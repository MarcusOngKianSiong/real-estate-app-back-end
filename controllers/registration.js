const database = require('../src/database.js')
const sp = require('synchronized-promise');
const { destroySession } = require('../src/jwt_service.js');
/*
SCRIPT STRUCTURE:
1. High level function: all other functions will be put into this function
2. Check 1: Password confirmation
3. Check 2: Unique registration data
3. Supporting functions
*/

// ----------------HIGH LEVEL: Ecapsulating all the registration data checks into a single function ------------------------
const checkRegistrationData = (data,accounts)=>{
    console.log("CHECKING REGISTRATION DATA......");
    const registrationDataErrorDetails = {};
    
    // CONDITION: NEED TO PASS A TOTAL OF TWO CHECKS!!!!
    // Check 1: Password confirmation match password
    const check1 = checkPassWordConfirmation(data["password"],data["password_confirmation"]);
    if(check1 === "pass"){
        // Check 2: Registration data is unique
            const check2 = checkUniqueRegistrationData(accounts,data);
            return check2;
    }else{
        return registrationDataErrorMessage(registrationDataErrorDetails,"password_confirmation","Password and Password confirmation does not match.")
    }
}

// -----------------------CHECK 1: Password confirmation-------------------
const checkPassWordConfirmation = (password,password_confirmation) => {
    console.log("CHECK 1: CHECKING PASSWORD CONFIRMATION.....")
    if(password === password_confirmation){
        console.log(`Result: pass`);
        return "pass";
    }
    console.log(`Result: Fail`);
    return "fail";
}

// ----------------------CHECK 2: unique registration data---------------------
// DESCRIPTION: RUN THROUGH EVERY SINGLE REGISTRATION DATA TO DETERMINE IF IT IS A UNIQUE VALUE
const checkUniqueRegistrationData = (accounts,registrationData) => {
    console.log("CHECK 2: Checking if registration data is unique.......");
    // Loop through every existing account
    
        let errorObject = {};                             // A list of dataType that already has a duplicate value.
        // Loop through each piece of registration data
        for (const dataType in registrationData){
                // For each piece of registration data, loop through each account that exist
                if(dataType !== "password_confirmation"){
                    const dataTypePassOrNot = determineUniqueValue(accounts,dataType,registrationData[dataType],errorObject);
                    // Is the data held by a dataType in the RegistrationData not unique?
                    if (dataTypePassOrNot !== "pass"){
                        // If it is not unique, then add the new error in the errorObject
                        errorObject = dataTypePassOrNot;
                    }
                }
        }
        
        // Pass the final result.
        if(Object.keys(errorObject).length === 0){
            // errorObject of length 0 = registration data passed all conditions
            console.log("Result: Pass");
            return "pass"
        }else{
            // errorObject of length > 0 = registration data did not pass one or more conditions.
            console.log(`Result: Fail - `,errorObject);
            return errorObject;
        }
    
}

// DESCRIPTION: run through every single account to check if there is a datatype match between registration data and account data
const determineUniqueValue = (accounts,dataType,dataToCheck,errorObject) => {
    // Loop through each account
    let catchingError = {}
    accounts.forEach((account)=>{
        // Determine if the data held by a datatype in an account is identical to dataToCheck
        const determination = account[dataType] === dataToCheck;
        if (determination === true){
            catchingError = registrationDataErrorMessage(catchingError,dataType,`${dataType} already exist. Please use another ${dataType}`);
        }
    })
    if (Object.keys(catchingError).length === 0){
        return "pass"
    }else{
        return {...errorObject,...catchingError};
    }
}

// ----------------SUPPORTING FUNCTIONS---------------------
const registrationDataErrorMessage = (template,dataType,errorMessage) => {
    template[dataType] = errorMessage;
    return template;
}

const NewAccount = (registrationData)=>{
    return database.account.create(registrationData)
}

// what does value create return?
// 
let createNewAccount = sp(NewAccount)




// const createNewAccount = (registrationData)=>{
//     const outcome = newAccount(registrationData);
//     console.log("HELLO THERE: ",outcome)
//     if(outcome){
//         console.log("CREATE NEW ACCOUNT: New account created.");
//         return true
//     }else{
//         console.log("CREATE NEW ACCOUNT: Error")
//         return false
//     }
// }

module.exports = {checkRegistrationData,createNewAccount}; 

// console.log("this: ",createNewAccount({name: "hiey", email: "hiey@gmail.com", password: "hiey"}))