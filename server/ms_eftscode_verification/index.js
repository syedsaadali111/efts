const eftsCode = require('./eftscodedb');
const Citizens = require('./citizendb'); 
const p_inst_rules =  require("./public_institute_rulesdb");
const mongoose = require('mongoose'); 
const express = require('express');

const app = express()
app.use(express.json());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 

app.get('/verify', (req, res) => {
  eftsCode.findOne({"Codes.EFTScode": req.body.efts},(err, data_c)=>{
              if(err){
                  res.sendStatus(500);
              }
              else if(data_c == null){
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

var flag = "";
var traveldate = "";
var endTime = -1;
var startTime = -1;
var checkTime = -1;
var occupDeny;
var citizen_age  = -1;
var MaxAge  = -1;
var MinAge = -1;
app.get('/verifyRule', (req, res) => {
      p_inst_rules.find({context:req.body.context},(err,data_pInst)=>{

        for(var i=0;i<data_pInst.length;i++){
          endTime  = parseInt(data_pInst[i].timeTo);
          startTime  = parseInt(data_pInst[i].timeFrom);
          checkTime = parseInt(req.body.travelTime);
          MaxAge = data_pInst[i].maxAge;
          MinAge = data_pInst[i].minAge; 

          if(checkTime == 0 ){
            checkTime =24;
          }
          if (endTime < startTime){
            endTime = endTime + 24 
            }
          traveldate = GetDateObject(req.body.travelDate);
          var d1 = Date.parse(traveldate);
          var d2 = Date.parse(data_pInst[i].startDate);
          var d3 = Date.parse(data_pInst[i].endDate);
          var d = new Date(traveldate);
          var n = d.getDay()  
          if(n ==0){
            n=7;
          }  
          if (d2 < d1 && d1 < d3) {
            if(data_pInst[i].days.includes(n) == true){
              flag = {status : "rejected due to curfew days"}
              res.json(flag)

              break;
            }
            else if(data_pInst[i].travelFrom.includes(req.body.travelFrom) || data_pInst[i].travelTo.includes(req.body.travelTo))
          {
            flag = {status : "rejected due to Zones"}
            res.json(flag)
            break;
          }
          else if(startTime < checkTime && checkTime < endTime){
            flag = {status : "rejected due to Time"}
            res.json(flag)

            break;
            
          }
          else{
             occupDeny =data_pInst[i].occupationDeny
             eftsCode.findOne({"Codes.EFTScode": req.body.eftsCode},(err,data_e)=>{
              if(err){
                res.sendStatus(500)
              }
              if (data_e == null){
                flag = {status : "EFTS is Wrong"}
              }
              else {
                Citizens.findOne({TC : data_e.TC },(err,data_c)=>{
                  if(err){
                    res.sendStatus(500)
                  }
                  else if (data_c == null){
                    res.sendStatus(400)
                  }
                  else {
                    const obj = jsonParser(data_c)
                    citizen_age = calcAge(GetDateObject(data_c.DOB))
                    if(occupDeny.includes(obj)){
                      flag = {status : "rejected due to occupation"}
                    }
                   
                    else if (!(MinAge < citizen_age && citizen_age <MaxAge)){
                      flag = {status : "rejected due to Age"}
                    }

                    else {
                      flag = {status : "allowed"}
                    }

                  }
                })
              }

          })
          }
            
          }
          
          else{
              flag= {status : "rejected due to Date Range "}
            }
        res.json(flag)
        }       

        
      })
})

function jsonParser(stringValue) {

  var string = JSON.stringify(stringValue);
  var objectValue = JSON.parse(string);
  return objectValue['occupation'];
}

var GetDateObject = function ( dateString){
           
  var array = dateString.split('/');

  var day = parseInt(array[0]);
  var month = parseInt(array[1]);
  var year = parseInt(array[2]);
  var dateObject = month+"/"+ day +"/"+ year;
  return dateObject;
   }

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }

const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});