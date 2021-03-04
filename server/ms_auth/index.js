const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const login_user = require('./userdb');
const Citizens = require('./citizendb');
const Code = require('./codedb');
const jwt = require('jsonwebtoken')
const axios = require('axios');
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
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  Citizens.findOne({TC : req.body.TC},(err,data_first)=>{
      if(data_first != null){
        res.status(401).send("Data is already present")
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
                    TC : req.body.TC,
                    password : hashedPassword
                  })
                
                    new_login.save((err,data_n)=>{
                      if(err){
                        res.status(500).send(err);
                      }else{
                        
                      res.status(200).send("User Created");
                    }
                    })
              }


              })
      }
  })
  
  
})



app.post('/login', async (req, res) => {    
    login_user.findOne({id: req.body.id},  async  (err, data) => {
        if (err) {
          res.status(500).send(err);
        } 
        else if (data== null){
            res.status(400).send("ID is unregistered");                                              //If the user DOES NOT EXITS, then this message will be send as response.
        }
        else {
          function replacer(key, value) {
            return value.password;    
        }
        const userStr = JSON.stringify(data, replacer);
        var output = userStr.replace(/['"]+/g, '')
        
        try {
                if(await bcrypt.compare(req.body.password, output, function(err, matches) {
                    if (err)
                      // res.json({id : err});
                      res.status(400).json({"msg": "Invalid Credentials"});
                    else if (matches){
                      const username =  req.body.id
                      const user = {id  :  username}
                      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                      res.json({ id : username,
                                access_token : access_token})
                    }
                    else
                      // res.json({id : null});
                      res.status(400).json({"msg": "Invalid Password"});
                  }));
              } catch {
                res.status(500).send("Error")
              }
      
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
            if(data_c == null){
              // res.status(400).send("EFTS Code not generated for this user\n"+data);                                              //If the user DOES NOT EXITS, then this message will be send as response.
              const result={
                id : data.TC,
                fname : data.FName,
                sname : data.SName,
                gender : data.Gender,
                EFTScode : null,
                QRCode : null
              }
              res.status(200).json(result);
            }
            else {
              const result={
                id : data.TC,
                fname : data.FName,
                sname : data.SName,
                gender : data.Gender,
                EFTScode : data_c.EFTScode,
                QRCode : data_c.qrcode_image
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