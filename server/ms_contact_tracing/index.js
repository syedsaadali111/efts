const eftsCodes = require('./eftscodes')
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const mongoose = require('mongoose');
const parameters = require('./parameters');

const app = express();
app.use(express.json());
app.use(cors());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made.


//http://3.136.62.151:7474/browser/
const neo_uri = 'neo4j://3.136.62.151:7687';
const driver = neo4j.driver(neo_uri, neo4j.auth.basic('neo4j', 'efts'));


app.post('/citizen', (req, res) => {
    const session = driver.session();

    const writeTxPromise = session.writeTransaction(async tx => {
        const result = tx.run('MERGE (p:Citizen {id: toInteger($id), isInfected: false, riskFactor: toFloat(0.0)}) RETURN p', {id: req.body.id});
        return result;
    });

    writeTxPromise.then((result) => {
        res.json({
            msg: 'Node Created.',
            createdNode: result.records[0]
        });
        session.close();
    });
});

// app.post('/code', (req, res) => {

//     if(typeof req.body.id !== "number" || typeof req.body.eftsCode !== "string") {
//         res.status(400).json({msg: "Required Body Params: id, eftsCode"});
//         return;
//     }

//     const session = driver.session();

//     const writeTxPromise = session.writeTransaction(async tx => {
//         const result = tx.run('MATCH (c:Citizen {id: $id}) ' + 
//                               'SET c.eftsCode = $eftsCode ' + 
//                               'RETURN c', {id: req.body.id, eftsCode: req.body.eftsCode});
//         return result;
//     });

//     writeTxPromise.then((result) => {
//         if(result.records.length == 0) {
//             res.status(400).json({msg: "Failed. Cannot find any citizen with provided id."})
//             return;
//         }
//         res.json({
//             msg: 'Code Added.',
//             updatedNode: result.records[0]
//         });
//     }).catch( (e) => {
//         res.status(400).json({msg: e.code});
//     }).then( () => {
//         session.close();
//     });
// });

app.get('/calculate', async (req, res) => {

    const subjectId = req.query.id;
    console.log(subjectId);

    //check if person is positive
    const citizen = await eftsCodes.findOne({"TC": subjectId});
    
    if(!citizen) {
        res.status(500).json({msg: 'Cannot find citizen data in the database'});
        return;
    }

    if (citizen?.Status) {
        res.json({isPositive: true});
        return;
    }

    const session = driver.session();

    const readTxPromise = session.readTransaction(async tx => {
        const result = tx.run('MATCH p=allShortestPaths((:Citizen {id: toInteger($id)})-[:MET*1..4]-(c:Citizen)) ' +
                                'WHERE c.id <> toInteger($id) ' +
                                'RETURN c, relationships(p) AS r ', {id: subjectId});
        return result;
    });

    readTxPromise.then(async (result) => {
        const records = result.records.map((r) => {
            const relationship = r.get('r')[0].properties;
            relationship.timestamp = parseInt(relationship.timestamp.toString());
            return {
                citizenId: parseInt(r.get('c').properties.id.toString()),
                relationship: relationship,
                degreeOfContact: r.get('r').length
            }
        });
        console.log('RECORDS', records);

        //return risk factor of 0 if no contacts
        if(!records.length) {
            res.json({riskFactor: 0, msg: 'No contacts found for this citizen'});
            return;
        }

        //prepare id array for mongoDB query
        const ids = [...new Set([...records.map( r => r.citizenId)])];

        //query mongoDB for postive citizens
        const positives = await eftsCodes.find({"TC": {"$in": ids}, "Status": true});
        
        if(!positives.length) {
            res.json({riskFactor: 0, msg: 'No potentially risky contacts found for this citizen'});
            return;
        }

        const positiveIds = positives.map( p => p.TC);

        //filter neo4j results to include contacts with positive people
        const positiveRecords = positiveIds.map( id => {
            const recordsForId = records.filter(r => r.citizenId === id);
            const singularRecord = recordsForId.reduce((prev, curr) => { //get latest contact
                return prev.relationship && (prev.relationship.timestamp > curr.relationship.timestamp) ? prev : curr 
            }, Number.NEGATIVE_INFINITY);
            return singularRecord;
        });
        console.log("Positive Records: ", positiveRecords);

        //get mf and rl from mongoDB
        const params = await parameters.find({});
        let days, outdoors, duration, degree;
        params.forEach( (param) => {
            switch(param.factor_label) {
                case 'days':
                    days = param;
                    break;
                case 'outdoors':
                    outdoors = param;
                    break;
                case 'duration':
                    duration = param;
                    break;
                case 'degree_of_contact':
                    degree = param;
                    break;
            }
        });
        
        const riskFactors = positiveRecords.map( record => {
            //Factor 1, number of days
            const {multiplication_factor: daysMf, risk_levels: daysRl} = days;
            
            const now = new Date().getTime();
            const daysPast = (now - record.relationship.timestamp) / (3600 * 24 * 1000);

            let daysRf;
            if (daysPast <= 3)
                daysRf = daysRl[0] * daysMf;
            else if (daysPast <= 6)
                daysRf = daysRl[1] * daysMf;
            else if (daysPast <= 10)
                daysRf = daysRl[2] * daysMf;
            else if (daysPast <= 14)
                daysRf = daysRl[3] * daysMf;
            else
                daysRf = daysRl[4] * daysMf;

            //Factor 2, indoors/outdoors
            const {multiplication_factor: outdoorsMf, risk_levels: outdoorsRl} = outdoors;
            const outdoorsRf = record.relationship.outdoors ? outdoorsMf * outdoorsRl[1] : outdoorsMf * outdoorsRl[0];

            //Factor 3, duration
            const {multiplication_factor: durationMf, risk_levels: durationRl} = duration;

            let durationRf = durationMf * durationRl[1]; //default to mid

            switch(record.relationship.duration) {
                case 'high':
                    durationRf = durationRl[0] * durationMf;
                    break;
                case 'mid':
                    durationRf = durationRl[1] * durationMf;
                    break;
                case 'low':
                    durationRf = durationRl[2] * durationMf;
                    break;
            }

            //Factor 4, degree of contact
            const {multiplication_factor: degreeMf, risk_levels: degreeRl} = degree;
            const degreeRf = degreeMf * degreeRl[record.degreeOfContact - 1];

            const maxValue = daysMf * Math.max(...daysRl) +
                            outdoorsMf * Math.max(...outdoorsRl) +
                            durationMf * Math.max(...durationRl) +
                            degreeMf * Math.max(...degreeRl);
                
            return {
                riskFactor: (daysRf + outdoorsRf + durationRf + degreeRf) / maxValue,
                details: {
                    daysPast: Math.floor(daysPast),
                    duration: record.relationship.duration,
                    degreeOfContact: record.degreeOfContact,
                    outdoors: record.relationship.outdoors
                },
                isPositive: false
            }
        });
        console.log(riskFactors);

        const maxRiskFactor = riskFactors.reduce( (prev, curr) => {
            return prev.riskFactor && (prev.riskFactor > curr.riskFactor) ? prev : curr;
        }, Number.NEGATIVE_INFINITY);

        res.send(maxRiskFactor);
        session.close();
    }).catch( (e) => {
        console.log(e);
        res.status(500).json({msg: "Internal Server Error. Try again."})
    });
});

app.post('/filiation',async (req, res) => {
    
    let flagMsg = null;

    if(req.body.from == undefined || req.body.to == undefined || !Array.isArray(req.body.to)) {
        res.status(400).json({msg: "Invalid Parameters"});
        return;
    }
    
    const EFTSpromises = req.body.to.map(async x => {
        return (eftsCodes.findOne({"Codes.EFTScode": x }).exec())
    });

    const ids = await Promise.all(EFTSpromises);
    
    const TC_array = ids.map(obj => {
        if (obj === null){
            flagMsg = 'One or more EFTS codes are invalid';
            return obj;
        }

        if (obj.TC === req.body.from) {
            flagMsg = 'You cannot enter your own EFTS code here';
            return obj;
        }
        
        return(obj.TC);
    });

    if (flagMsg){
        res.status(400).json({msg: flagMsg });
        return;
    }
    
    const session = driver.session();

    const writeTxPromise = session.writeTransaction(async tx => {

        const promises = TC_array.map( async id => {
            const res = await tx.run('MATCH (c1:Citizen {id: $from}), (c2:Citizen {id: $to})'
                            + 'MERGE (c1)-[r:MET]-(c2)'
                            + 'SET r.duration = toString($duration), r.timestamp = timestamp(), r.outdoors = toBoolean($outdoors) '
                            + 'RETURN c1.id, c2.id'
                            , {from: req.body.from, to: id, duration: req.body.duration, outdoors: req.body.outdoors});
            return res;
        })

        const results = await Promise.all(promises);
        const resultsRefined = results.map( res => {
            return {
                to: res.records[0].get("c2.id"),
                from: res.records[0].get("c1.id")
            };
        })

        return resultsRefined;
    });

    writeTxPromise.then((result) => {
        res.json({
            msg: 'Relationship Created.',
            createdRelations: result
        });
    }).catch(error => {
        console.log(error);
        res.status(400).json({msg: "Relationship Creation Failed. Check the request body params." });
    }).then( () => {
        session.close();
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`runnin on port ${PORT}`);
});
