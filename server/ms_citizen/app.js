var mongoose = require('mongoose'); //required for the DB connection with MongoDB
var express = require('express'); // required for the API formation 
const Citizens = require('./citizendb'); //This is the Schema created for insert , retreive and deletion purpose. However, we are only using retrive
Cors = require("cors"); // required for providing connection in the middleware. 

const app = express(); 
const port = process.env.PORT || 3000; //listening to port 3000

app.use(express.json());  //JSON format 
app.use(Cors()); 

app.set('view engine','ejs'); //pointing to the views for .ejs file rendering
app.use(express.urlencoded()); 

const connectionURL = "mongodb+srv://admin:admin@cluster0.plhxn.mongodb.net/EFTS?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //DB connection made. 


app.get("/", (req, res) => res.render('home'));

app.post('/',(req,res)=>{                                                     //This is the post request from the Submit Button in .ejs file. 
    Citizens.find({ TC : req.body.TC,                                         //This is the query inorder to verify the user.
                    FName : req.body.FName,                                   // This query returns a JSON Object which will be displayed on 
                    SName: req.body.SName,                                    // the screen if the user credentials are correct.
                    DOB : req.body.DOB},(err, data) => {
        if (err) {
          res.status(500).send(err);
        } 
        else if (data.length == 0){
            res.status(404).send("No User Found");
        }
        else {
          res.status(200).send(data);                                         //If the user exists, the information of the user is displayed
        }
      });
});

app.listen(port, () => console.log(`Listening on localhost: ${port}`)); //Listening to PORT = 3000
