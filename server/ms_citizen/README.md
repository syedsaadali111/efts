## This folder contains the citizen microservice containing user verification code.
The Port Number used by the Verification is : 5001

The Route used is : /verify

Inputs for the Verification : 

        TC : NUMBER
        First Name : String
        Last Name :  String
        Date of Birth : String  (dd/mm/yyyy)
    
If the inputs are correct and the query is successful , it will return the JSON Object containing the data of the verified user along with status code 200.

Even if any single input is not correct, then it will display the error message  "No User Found" along with status 400.