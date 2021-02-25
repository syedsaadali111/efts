## This folder contains the citizen microservice containing user verification code.
The Port Number used by the Authentication Microservice is : 5003

The Routes used are : 

POST REQUEST(S)

/signup

{
    "TC": 99464426730,                                           //Number
    "fname" : "ABC",                                            //String
    "sname" : "XYZ",                                            //String
    "dob" : "15/06/1999",                                       //String
    "gender" : "Male",                                          //String
    "email" : "abc.xyz@qwert.com",                              //String
    "occupation" : "Student",                                   //String
    "phone" : 1234567,                                          //Number 
    "password" : "yourpasswordwillbehashedandstored"           //String

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


GET REQUEST(S)


/getUser 

Authorization: Bearer Enter the access Token
