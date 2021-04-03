const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const login_user = require('./userdb');
const Citizens = require('./citizendb');
const Code = require('./codedb');
const jwt = require('jsonwebtoken')
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config()
const app = express()

app.use(express.json())
app.use(cors());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 

app.post('/signup',async (req,res)=>{

  const id_TC =  req.body.TC
  const user = {id  :  id_TC}
  const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  var link = "http://localhost:5003/verifyuser/"+access_token;

  function sendEmail() {
    return new Promise((resolve, reject)=>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL ,
            pass: process.env.PASSWORD
        }
      });

      let mailOptions = {
        from: process.env.EMAIL , 
        to: req.body.email, 
        subject: "SignUp Confirmation",
        html: link
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            reject("Email is NOT SENT!!!!!")
        } 
        else{
            resolve('Email IS Sent')
        }      
      });

    })
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  Citizens.findOne({TC : req.body.TC},(err,data_first)=>{
      if(data_first != null){
        res.status(401).send("Data is already present");
        return;
      }
      else{
                const result= new Citizens({
                TC : req.body.TC,
                FName : req.body.fname,
                SName : req.body.sname,
                DOB : req.body.dob,
                Gender : req.body.gender,
                Email : req.body.email,
                Occupation : req.body.occupation,
                Phone : req.body.phone,
                password : req.body.password
              });
              result.save((err,data)=>{
                if(err){
                  console.log(err);
              }else{
                const new_login  = new login_user({
                  id : req.body.TC,
                  password : hashedPassword
                });
              
                new_login.save((err,data_n)=>{
                  if(err){
                    res.status(500).send(err);
                  }else{
                    // create citizen node in neo4j
                  axios.post(('http://localhost:5000/citizen'), {
                    id: req.body.TC
                  }).then(() => {
                    sendEmail().then(val=> {
                      res.status(200).json({"info" : "User Created", "msg" : val})
                    }).catch( err => {
                      console.log("SMTP error");
                      res.status(500).send(err);
                    });
                  }).catch( (err) => {
                      console.log("Neo4j error");
                      res.status(500).send(err);
                  });
                }
                })
              }


            })


      }
  });
 
})

app.get('/verifyuser/:token',(req,res)=>{

  const check = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET)
  login_user.findOneAndUpdate({id:check.id},{active:true},(err,data)=>{
    if(data.active){
      res.status(200).json({"msg" : "Your Account is already verified"});
    }
    else{
      res.status(200).send({"msg" : "Your account has been verrified"});
    }
  }) 

})

app.post('/login', async (req, res) => {    
    login_user.findOne({id: req.body.id},  async  (err, data) => {
        if (err) {
          res.status(500).send(err);
          return;
        } 
        if (data== null){ //If the user DOES NOT EXITS, then this message will be send as response.
          res.status(401).json({"msg": "Invalid Credentials"});
          return;
        }

        function replacer(key, value) {
          return value.password;    
        }
        const userStr = JSON.stringify(data, replacer);
        var output = userStr.replace(/['"]+/g, '')

        try {
          if(await bcrypt.compare(req.body.password, output, function(err, matches) {
            if (err){
              res.status(401).json({"msg": "Invalid Credentials"});
              return;
            }
            else if (matches){
              if(data.active == false){
                res.status(401).json({ "msg" :"Your account is not active. Kindly check your email to verify"});
                return;
              }
              const username =  req.body.id
              const user = {id  :  username}
              const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
              res.json({ id : username,
                        access_token : access_token})
              return;
            }
            else {
              res.status(401).json({"msg": "Invalid Credentials"});
              return;
            }
          }));
        } catch {
          res.status(500).send("Error");
          return;
        }

    }); 

})



app.post('/forgotpassword', async (req, res) => {
    //   res.json(users)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
        login_user.findOneAndUpdate({id: req.body.id},
                         {password: hashedPassword},
                         (err, data) => {
            if (err) {
              res.status(500).send(err);
            } 
            else if (data.length == 0){
                res.status(400).send("Password Not Changed");                                              //If the user DOES NOT EXITS, then this message will be send as response.
            }
            else {
              res.status(200).send("Password Changed Succesfully\n");                                       //If the user exists, the Identity Number of the user is sent as respnse. 
            }
          }); 
    
    })




    app.get('/getUser', authenticateToken, (req, res) => {
      Citizens.findOne({TC : req.user.id}, (err,data) => {
        if (err) {
          res.status(500).send("err");
        } 
        else if (data == null){
            res.status(400).send("no such user");                                              //If the user DOES NOT EXITS, then this message will be send as response.
        }
        else {
          Code.findOne({TC: req.user.id}, (err,data_c)=>{
            if(data_c == null){                                         //If the user DOES NOT EXITS, then this message will be send as response.
              const result={
                id : data.TC,
                fname : data.FName,
                sname : data.SName,
                gender : data.Gender,
                eftsCodes: []
              }
              res.status(200).json(result);
            }
            else {
              const result={
                id : data.TC,
                fname : data.FName,
                sname : data.SName,
                gender : data.Gender,
                eftsCodes: data_c.Codes
              }
              res.status(200).json(result);                                         //If the user exists, the Identity Number of the user is sent as respnse. 
            }
          })
        }
      })
  
  })
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  const PORT = 5003;
  app.listen(PORT, () => {
      console.log(`Running on port number ${PORT}`);
  });