const eftsCodes = require('./eftscodes')
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const mongoose = require('mongoose');

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
