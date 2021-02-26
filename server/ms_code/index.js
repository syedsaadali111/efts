require('dotenv').config();

//twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const express = require('express');
const randomstring = require('randomstring');
const hashSum = require('hash-sum');

const axios = require('axios');

// required for providing connection in the middleware. 
const cors = require("cors"); 
const userModel = require('./user');
const mongoose = require('mongoose');
const QRCode = require('qrcode');

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";

//connect to db
mongoose.connect(connectionURL, { useNewUrlParser: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))

//connect express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.post('/generate', (req, res) => {

    if (typeof req.body.id !== "number") {
        res.status(400).send({ msg: "Failed. Incorrect format for: id" });
        return;
    }
    else {
        //create hash from citizen id
        var hashcode = hashSum(req.body.id);
        //divide code into 4 sections and add EFTS at the beginning
        var eftsCode = "EFTS-" + hashcode.slice(0, 4) + "-" + hashcode.slice(4) + "-" + randomstring.generate(4);
        //var hashcode = hashSum(req.body.id)
        //res.status(200).send(eftsCode);

        //send to mongodb
        QRCode.toDataURL(eftsCode, { errorCorrectionLevel: 'H' }, function (err, url) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                var userr = new userModel({
                    TC: req.body.id,
                    EFTScode: eftsCode,
                    qrcode_image: url
                });
                userr.expirationDate = new Date(Date.now() + 24883200000);
                userr.save((err, data) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {

                        axios.post('http://localhost:5000/code', {
                            "id": req.body.id,
                            "eftsCode": eftsCode
                        }).then( () => {
                            console.log('neo4j code added');

                            //sending an sms with the EFTS code to the user
                            var smsMsg = "\nYour EFTS Code: \n" + eftsCode;

                            twilioClient.messages.create({
                                body: smsMsg,
                                from: '+14793483249',
                                to: '+905454683730',
                                // to: '+905076752437',
                            })
                            .then((msg) => {
                                res.status(200).json({
                                    msg: 'EFTS Code successfully generated and sent as an SMS.',
                                    efts: eftsCode,
                                    id: req.body.id,
                                    qrcode: url,
                                    smsMsg: msg
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(200).json({
                                    msg: 'EFTS Code successfully generated and sent as an SMS.',
                                    efts: eftsCode,
                                    id: req.body.id,
                                    qrcode: url,
                                    smsMsg: null
                                });
                            });
                        })                        
                    }
                });
            }
        });
    }

});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});

