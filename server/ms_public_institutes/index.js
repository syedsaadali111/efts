const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const login_institute = require('./public_institute_logindb');
const PublicInstitute = require('./public_institutedb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()

app.use(express.json())

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 



app.post('/signup',async (req,res)=>{
  const PhashedPassword = await bcrypt.hash(req.body.password, 10)
  PublicInstitute.findOne({id : req.body.id},(err,data_first)=>{
      if(data_first != null){
        res.status(401).send("Data is already present")
      }
      else{
                const result= new PublicInstitute({
                id : req.body.id,
                name : req.body.name,
                context : req.body.context,
                rule_issuer : req.body.rule_issuer,
                description : req.body.description,
                email : req.body.email,            
                phone : req.body.phone,
                address : req.body.address
              });
              result.save((err,data)=>{
                if(err){
                  console.log(err);
              }else{
                const plogin = new login_institute({
                    id : req.body.id,
                    password : PhashedPassword

                })
                
                plogin.save((err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.status(200).send("Insitute Created");

                    }
                })
              }
              })
      }
  })
  
  
})

app.post('/forgotpassword', async (req, res) => {
 
  
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    login_institute.findOneAndUpdate({id: req.body.id},
                         {password: hashedPassword},
                         (err, data) => {
            if (err) {
              res.status(500).send(err);
            } 
            else if (data == null){
                res.status(400).send(req.body);                                              //If the user DOES NOT EXITS, then this message will be send as response.
            }
            else {
              res.status(200).send("Password Changed Succesfully\n");                                       //If the user exists, the Identity Number of the user is sent as respnse. 
            }
          }); 

}) 
    
    

app.post('/login', async (req, res) => {    
    login_institute.findOne({id: req.body.id},  async  (err, data) => {
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
                      res.json({id : err});
                    else if (matches){
                      const username =  req.body.id
                      const user = {id  :  username}
                      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                      res.json({access_token : access_token})
                    }
                    else
                      res.json({access_token : null});
                  }));
              } catch {
                res.status(500).send("Error")
              }
      
        }
      }); 

})



app.get('/getInfo', authenticateToken, (req, res) => {
    PublicInstitute.findOne({id : req.user.id}, (err,data) => {
      if (err) {
        res.status(500).send("err");
      } 
      else if (data == null){
          res.status(400).send("no such user");                                              //If the user DOES NOT EXITS, then this message will be send as response.
      }
      else {
        res.status(200).json(data)
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

app.post('/createRule',(req,res)=>{

    
})



  const PORT = 5003;
  app.listen(PORT, () => {
      console.log(`Running on port number ${PORT}`);
  });