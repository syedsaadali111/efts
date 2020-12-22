const express = require('express');
var hashSum = require('hash-sum');

const app = express();
app.use(express.json());

// var hashcode = hashSum(99841231231); 
//     console.log(hashcode); 
//     var txt2 = hashcode.slice(0, 4) + "-" + hashcode.slice(3);
//     console.log (txt2); 
//     //var hashcode = hashSum(req.body.id)
//     var eftsCode = "EFTS-" + txt2; 
//     console.log(eftsCode); 

app.post('/generate', (req, res) => {
    //just to check
    console.log(req.body);
    console.log("req body id " + req.body.id);


    if (typeof req.body.id !== "number") {
        res.status(400).send({ msg: "Failed. Incorrect format for: id" });
        return;
    }
    else {
        //create hash from citizen id
        var hashcode = hashSum(req.body.id);
        console.log(hashcode);
        //divide code into 3 sections and add EFTS at the beginning
        var eftsCode = "EFTS-" + hashcode.slice(0, 4) + "-" + hashcode.slice(3);
        console.log(eftsCode);
        //var hashcode = hashSum(req.body.id)
        //res.status(200).send(eftsCode);
        res.json({
            msg: 'EFTS Code successfully Generated.',
            efts: eftsCode
        });
    }

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});

