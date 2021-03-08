const userModel = require('./eftscodedb');
const Citizens = require('./citizendb'); 
const mongoose = require('mongoose'); 
const express = require('express')

const app = express()
app.use(express.json());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 

app.post('/verify', (req, res) => {
  userModel.findOne({"Codes.EFTScode": req.body.efts},(err, data_c)=>{
              if(data_c == null){
                  res.send("Code is not present")

              }
              else {
                Citizens.findOne({TC : data_c.TC},(err,data)=>{
                  if(data == null){
                      res.status(400).send("Citizen Data not present")
                  }
                  else {
                    const result = {
                      id : data_c.TC,
                      Name  : data.FName +" "+data.SName ,
                      EFTS_code : req.body.efts,
                      status : data_c.Status
                    }
                      res.status(200).json(result)
                  }
                })
                
              }
          })

})


const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});