const express = require('express');
const randomstring = require('randomstring');
var hashSum = require('hash-sum');

Cors = require("cors"); // required for providing connection in the middleware. 
var userModel = require('./user');
var mongoose = require('mongoose');

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";

//connect to db
mongoose.connect(connectionURL, { useNewUrlParser: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))

//connect exptress
const app = express();
app.use(express.json());
app.use(express.urlencoded()); 


//testing with hardcoding
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
        //divide code into 4 sections and add EFTS at the beginning
        var eftsCode = "EFTS-" + hashcode.slice(0, 4) + "-" + hashcode.slice(4) + "-" + randomstring.generate(4);
        console.log(eftsCode);
        //var hashcode = hashSum(req.body.id)
        //res.status(200).send(eftsCode);

        res.json({
            msg: 'EFTS Code successfully Generated.',
            efts: eftsCode,
            id: req.body.id
        });

        //send to mongodb

        var userr = new userModel({
            TC:req.body.id,
            EFTScode:eftsCode,
            });
            userr.expirationDate = new Date(Date.now() + req.body.TTL);
            userr.save((err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Saved to Database");
                }
            });
    }

});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});

