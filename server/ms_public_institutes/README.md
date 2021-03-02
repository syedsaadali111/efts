## This folder contains the citizen microservice containing user Authentication.
The Port Number used by the Authentication Microservice is : 5004

For routes /deleteRule, /modifyRule , /getRule , /createRule, /getInfo  add token to header for authentication.

The Routes used are : 

POST REQUEST(S)

/signup

{
    "id": Number    
    "name" : String
    "context" : String                                            
    "rule_issuer" : boolean                                       
    "Description" : String                                          
    "email" : String                                                               
    "phone" : Number                                           
    "address" : String   
     "password": String                                                                      
}


/login


{
"id": Number, 
"password": String
}


/forgotpassword
{
"id": Number, 
"password": String
}

/createRule
{
        "id": Number
        "p_id" : Number          //public_institute_id
        "name": String
        "description": String
        "context" : String
        "sdate": String
        "edate": String
        "days": Array of Integers
        "priority": Number (1,2 or 3),
        "timeFrom" : String ("10:00")
        "timeTo": String ("21:00")
        "minAge" :Number
        "maxAge" : Numer
        "travelFrom" : String
        "travelTo": String
        "occupationAllow" : Array of String 
        "occupationDeny" : Array of String
        "ruleActive" :boolean
}

/modifyRule
{
        "id": Number
        "name": String
        "description": String
        "context" : String
        "sdate": String
        "edate": String
        "days": Array of Integers
        "priority": Number (1,2 or 3),
        "timeFrom" : String ("10:00")
        "timeTo": String ("21:00")
        "minAge" :Number
        "maxAge" : Numer
        "travelFrom" : String
        "travelTo": String
        "occupationAllow" : Array of String 
        "occupationDeny" : Array of String
        "ruleActive" :boolean
}

GET REQUEST(S)


/getInfo 

Authorization: Bearer Enter the access Token


/deleteRule

{
    "id" : Number
}

/getRule
{
    "id" : Number
}