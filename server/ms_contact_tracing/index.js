const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const neo_uri = 'neo4j://18.216.10.216:7687';
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

app.post('/filiation', (req, res) => {
    
    if(req.body.from == undefined || req.body.to == undefined || !Array.isArray(req.body.to)) {
        res.status(400).json({msg: "Required Body Params: from, to[]"});
        return;
    }

    //get the ids of the citizens here

    //[] <-- all the ids that the user entered.

    const session = driver.session();

    const writeTxPromise = session.writeTransaction(async tx => {

        const promises = req.body.to.map( async eftsCode => {
            const res = await tx.run('MATCH (c1:Citizen {id: $from}), (c2:Citizen {id: $to})'
                            + 'MERGE (c1)-[r:MET]-(c2)'
                            + 'SET r.timestamp = timestamp()'
                            + 'RETURN c1.eftsCode, c2.eftsCode', {from: req.body.from, to: eftsCode});
            return res;
        })

        const results = await Promise.all(promises);
        const resultsRefined = results.map( res => {
            return {
                to: res.records[0].get("c2.eftsCode"),
                from: res.records[0].get("c1.eftsCode")
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
        res.status(400).json({msg: "Relationship Creation Failed. Check the request body params."});
    }).then( () => {
        session.close();
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`runnin on port ${PORT}`);
});
