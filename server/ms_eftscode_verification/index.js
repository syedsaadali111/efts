const eftsCode = require('./eftscodedb');
const Citizens = require('./citizendb'); 
const p_inst_rules =  require("./public_institute_rulesdb");
const mongoose = require('mongoose'); 
const express = require('express');
const cors = require("cors"); 

const app = express()
app.use(express.json());
app.use(cors());

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to db'))
.catch((err) => console.log(err)); //DB connection made. 

app.post('/verify', (req, res) => {
  eftsCode.findOne({"Codes.EFTScode": req.body.efts},(err, data_c)=>{
              if(err){
                  res.sendStatus(500);
              }
              else if(data_c == null){
                  res.status(400).send("Code is not present")

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
var flag_check_deny = false;

app.post('/verifyRule',(req,res)=>{
    // console.log(req.body)
  p_inst_rules.find({context : req.body.context},(err,data_r)=>{
      for(let i=0;i < data_r.length; i ++){
        if (data_r[i].ruleActive == true){
          endTime  = parseInt(data_r[i].timeTo);
          startTime  = parseInt(data_r[i].timeFrom);
          checkTime = parseInt(req.body.travelTime);

          if(checkTime == 0 ){
            checkTime =24;
          }
          if (endTime < startTime){
            endTime = endTime + 24 
            }

          MaxAge = data_r[i].maxAge;
          MinAge = data_r[i].minAge; 

          traveldate = GetDateObject(req.body.travelDate);
          var d1 = Date.parse(traveldate);
          var d2 = Date.parse(data_r[i].startDate);
          var d3 = Date.parse(data_r[i].endDate);

          if (d2 < d1){
            if(data_r[i].travelFrom.includes(req.body.travelFrom) || data_r[i].travelTo.includes(req.body.travelTo)){
              console.log("Restricted Zone")
              flag_check_deny = true;
              // res.send(flag_check_deny)
              break;
            }
            else{
              if(data_r[i].endDate != null || data_r[i].endDate != ""){
                var d3 = Date.parse(data_r[i].endDate);
                if(d1 < d3){
                  console.log(" date OK")
                  if (startTime <= checkTime && checkTime <= endTime){
                      console.log("Hours rule is applicable")
                      occupDeny =data_r[i].occupationDeny
                      eftsCode.findOne({"Codes.EFTScode": req.body.eftsCode},  (err,data_e)=>{
                        if(err){
                          res.sendStatus(500)
                        }
                        if (data_e == null){
                          console.log("EFTS is not present")
                          flag_check_deny = true;
                          // res.send(flag_check_deny)
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
                              // citizen_age  = 30
                              if(occupDeny.includes(obj)){
                                console.log("Allowed Occupation")
                              }
                              if (MinAge != 0 && MaxAge == 0){
                                if (MinAge > citizen_age){
                                  flag_check_deny =  true;
                                  console.log("Restricted !!!! ")
                                  // res.send(flag_check_deny)
                                }
                                else {
                                  console.log("OK !!!!")
                                }
                              }

                              else if (MinAge == 0 && MaxAge !=0){
                                    if (MaxAge < citizen_age){
                                      flag_check_deny = true;
                                      console.log("Restricted !!!! ")
                                      res.send(flag_check_deny)

                                    }
                                    else {
                                      console.log("OK !!!!")
                                    }
                              }

                              else if (MinAge == 0 && MaxAge == 0){
                                  console.log("Restricted for all  / send reject ")
                                  flag_check_deny = true;
                                  res.send(flag_check_deny)

                              }
                              else {

                                if (MinAge >  MaxAge){
                                  if (MinAge > citizen_age && MaxAge < citizen_age)
                                  {
                                      flag_check_deny =true;
                                      console.log("Restricted !!! " + flag_check_deny)
                                      res.send(flag_check_deny)
                                  }

                                }

                                if (MinAge > citizen_age || citizen_age > MaxAge){
                                  
                                  flag_check_deny = true  
                                  console.log("Restricted Age : " + flag_check_deny)    
                                  res.send(flag_check_deny)                        
                                }
                                
                              }
            
                            }
                          })
                        }
            
                    })
                    break ; 
                  }
                  else{
                    console.log("Hour Rule is not applicable")
                    flag_check_deny = true;
                  }
                
                
                }
                else if (d1 > d3){
                  console.log("This rule is inactive due to lesser end date")
                  flag_check_deny =true;
                }
                else{
                  console.log("No end date ")
                }
              }
            }
          }
          else {
              console.log("This rule is inactive due to greater start date")
          }

        }else{
          console.log("rule not active")
        }
    }  

    // res.send(flag_check_deny)
    


    }).sort({priority : -1})    
    if(res.send != null)
      {
        console.log(res.send)
      }
      else{
        res.send(flag_check_deny)
      }
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