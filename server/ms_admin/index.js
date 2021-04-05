const express = require('express')
const bcrypt = require('bcrypt')
const admin_user = require('./adminlogindb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
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
    admin_user.findOne({username : req.body.username},(err,a_data)=>{
        if(a_data != null){
            res.status(401).send("Admin user is already present");
        }
        else {
            const admin= new admin_user({
                username : req.body.username,
                password : hashedPassword,
                type : req.body.type
              });
              admin.save((err,data)=>{
                  if(err){
                      console.log(err)
                  }
                  else{
                      res.status(200).send(data);
                  }
              })
            }
    })
  
})

app.post('/login', (req,res)=>{
    admin_user.findOne({username : req.body.username}, async (err,data)=>{
        if(err){
          res.status(500).send(err);
          return;
        }
        if (data == null){
          res.status(401).json({"msg": "Invalid Credentials"});
          return;
        }
        else{
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
              const user = {id  :  req.body.username,
                            type : data.type}
              const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
              res.json({ id : data.username,
                          type : data.type,
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
        
      }
    })
})

app.post('/adduser',authenticateToken,async(req,res)=>{
  if(req.user.type == "superuser"){
    const hashedPassword_new_user = await bcrypt.hash(req.body.password, 10)
  
  admin_user.findOne({username : req.body.username},(err,data_user)=>{
    if(data_user){
      res.status(400).send("This user is already Exists")
    }
    else{
        const new_user= new admin_user({
        username : req.body.username,
        password :  hashedPassword_new_user,
        type : req.body.type
      });
      new_user.save((err,data)=>{
          if(err){
              console.log(err)
          }
          else{
              res.status(200).send(data);
          }
      })
    }
  });
  }
  else {
   res.status(400).send("User is not allowed to create another user.")
  }
  

})

app.post('/deleteuser', authenticateToken,(req,res)=>{
  if(req.user.type == "superuser"){
    if(req.body.username == "root"){
      res.status(400).send(req.body.username + " cannot be deleted !!Warning!!")

    }
    else{
  admin_user.findOneAndDelete({username : req.body.username},(err,data)=>{
    if(err){
      res.status(400).send(err)
    }
    else if(data == null){
      res.status(400).send(req.body.username + " User does not exits")
    }
    else{
      res.status(200).send(data.username + " User is deleted")
    }
  })
}
}
else{
  res.status(400).send("User is not allowed to delete another user.")
}
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



const PORT = 5005;
  app.listen(PORT, () => {
      console.log(`Running on port number ${PORT}`);
  });