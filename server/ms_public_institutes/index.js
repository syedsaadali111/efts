const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const login_institute = require('./public_institute_logindb');
const PublicInstitute = require('./public_institutedb');
const p_institute_rule = require ('./public_institute_rulesdb'); 
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()
const cors = require("cors"); 

app.use(express.json())
app.use(cors());
app.use(express.urlencoded());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 



app.post('/signup',async (req,res)=>{
  const PhashedPassword = await bcrypt.hash(req.body.password, 10)
  PublicInstitute.findOne({email : req.body.email},(err,data_first)=>{
      if(data_first != null){
        res.status(401).send("Data is already present")
      }
      else{
                const result= new PublicInstitute({
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
                    email : req.body.email,
                    password : PhashedPassword

                })
                
                plogin.save((err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.status(200).send("Institute Created");

                    }
                })
              }
              })
      }
  })
  
  
})

app.post('/forgotpassword', async (req, res) => {
 
  
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    login_institute.findOneAndUpdate({email: req.body.email},
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
    login_institute.findOne({email: req.body.email},  async  (err, data) => {
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
        
        PublicInstitute.findOne({email : req.body.email}, async (err,data_p)=>{
        try {
                if(await bcrypt.compare(req.body.password, output, function(err, matches) {
                    if (err)
                      res.json({email : err});
                    else if (matches){
                      const username =  req.body.email
                      const user = {email  :  username,
                                    rule_issuer : data_p.rule_issuer,
                                    p_id : data_p._id}
                      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                      res.json({access_token : access_token})
                    }
                    else
                    res.sendStatus(500);
                }));
              } catch {
                res.status(500).send("Error")
              }
        })
        
      
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


app.get('/getRules', authenticateToken, (req, res) => {
    p_institute_rule.find({p_id : req.user.p_id}, (err,data) => {
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

app.get('/getRuleInfo', authenticateToken, (req, res) => {
    p_institute_rule.findById(req.body._id, (err,data) => {
      if (err) {
        res.status(500).send(err);
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

app.post('/createRule',authenticateToken,(req,res)=>{
    if(req.user.rule_issuer == true){
    p_institute_rule.findOne({
        name:req.body.name,
        context : req.body.context,
        startDate: req.body.sdate,
        endDate: req.body.edate,
        days: req.body.days,
        priority: req.body.priority,
        timeFrom : req.body.timeFrom,
        timeTo: req.body.timeTo,
        minAge :req.body.minAge,
        maxAge : req.body.maxAge,
        ruleActive : req.body.ruleActive
    
    },(err,data)=>{
        if(err){
            res.send(err)
        }
        else if(data){
            res.send("Rule is already exists with same fields")
        }
        else{
            const rule = new p_institute_rule({
                p_id : req.user.p_id,
                name: req.body.name,
                description: req.body.description,
                context : req.body.context,
                startDate: req.body.sdate,
                endDate: req.body.edate,
                days: req.body.days,
                priority: req.body.priority,
                timeFrom : req.body.timeFrom,
                timeTo: req.body.timeTo,
                minAge :req.body.minAge,
                maxAge : req.body.maxAge,
                ruleActive : req.body.ruleActive
            })

            req.body.travelFrom.forEach(element =>{
                rule.travelFrom.push(element)
            });
            req.body.travelTo.forEach(element =>{
                rule.travelTo.push(element)
            });
            req.body.occupationDeny.forEach(element => {
                rule.occupationDeny.push(element);
        
            });
            rule.save((err,data)=>{
                if(err){
                    res.send(err);
                }else{
                    res.status(200).send("Rule Created");
        
                }
            })
        }

    })
}
else{
    res.status(400).send("Public Institute is not allowed to issue Rule.")
}
        

})



app.post('/modifyRule',authenticateToken,(req,res)=>{
    if(req.user.rule_issuer == true ){
    p_institute_rule.findByIdAndUpdate(req.body._id,{
            name: req.body.name,
            description: req.body.description,
            context : req.body.context,
            startDate: req.body.sdate,
            endDate: req.body.edate,
            days: req.body.days,
            priority: req.body.priority,
            timeFrom : req.body.timeFrom,
            timeTo: req.body.timeTo,
            minAge :req.body.minAge,
            maxAge : req.body.maxAge,
            ruleActive : req.body.ruleActive,
            "$set" : {
                travelFrom : req.body.travelFrom,
                travelTo: req.body.travelTo,
                occupationDeny: req.body.occupationDeny
            }
    },(err,data)=>{
        if(err){
            res.send(err)
        }
        else if (data == null){
            res.status(400).send("Rule Not Found");                                              //If the user DOES NOT EXITS, then this message will be send as response.
        }
        else {

            res.status(200).send("Rule is Modified");
        }
        

    })
}
else {
    res.status(400).send("Public Institute is not allowed to modify Rule.")


}
})

app.get('/deleteRule',authenticateToken,(req,res)=>{
    if(req.user.rule_issuer == true){

    p_institute_rule.findByIdAndDelete(req.body._id,(err,data)=>{
        if(err){
            res.send(err)
        }
        else if (data == null){
            res.send("ID is wrong . Rule not Deleted")
        }
        else{
            res.send("Rule is deleted")
        }

    })
    }
    else{

        res.status(400).send("Public Institute is not allowed to delete Rule.")

    }

})


  const PORT = 5004;
  app.listen(PORT, () => {
      console.log(`Running on port number ${PORT}`);
  });