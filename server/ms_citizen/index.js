var mongoose = require('mongoose'); //required for the DB connection with MongoDB
var express = require('express'); // required for the API formation 
const Citizens = require('./citizendb'); //This is the Schema created for insert , retreive and deletion purpose. However, we are only using retrive
Cors = require("cors"); // required for providing connection in the middleware. 

const app = express(); 
const port = process.env.PORT || 5001; //listening to port 5001

app.use(express.json());  //JSON format 
app.use(Cors()) ; 

app.set('view engine','ejs'); //pointing to the views for .ejs file rendering
app.use(express.urlencoded()); 

const connectionURL = "mongodb+srv://admin:admin@efts.zqahh.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //DB connection made. 


app.get("/verify", (req, res) => res.render('home'));

app.post('/verify',(req,res)=>{  
  const successful_result_message = {     //Message to be send as response if the the query is CORRECT / SUCCESSFUL QUERY 
    Message: "The User is verified",
    TC : req.body.TC
  } 

  const fail_result_message = {         // Message to be send as response if the query is WRONG/ FAILED QUERY 
  Message :"Failed User Verification"
  } 
    Citizens.find({ TC : req.body.TC,                                         //This is the query inorder to verify the user.
                    FName : req.body.FName,                                   // This query returns a JSON Object which will be displayed on 
                    SName: req.body.SName,                                    // the screen if the user credentials are correct.
                    DOB : req.body.DOB},(err, data) => {
        if (err) {
          res.status(500).send(err);
        } 
        else if (data.length == 0){
            res.status(400).send(fail_result_message);                                              //If the user DOES NOT EXITS, then this message will be send as response.
        }
        else {
          res.status(200).send(successful_result_message);                                         //If the user exists, the Identity Number of the user is sent as respnse. 
        }
      });
});

app.listen(port, () => console.log(`Listening on localhost: ${port}`)); //Listening to PORT = 5001
