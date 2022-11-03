    require('dotenv').config({path: '.env'});
    const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const sp = require('synchronized-promise')
const { account,session } = require('./database.js');

const JWT_SECRET = process.env.JWT_SECRET;
const algorithm = {algorithm: 'HS256'};

// const finding = sp(session.find);
// ------------ LEVEL 1: BASE COMPONENTS-----------------------------------------------
// ------------ LEVEL 1.1: MAKING MONGOOSE FUNCTIONS SYNCHRONOUS ---------------- 
const findRandomString = (string)=>{
    return session.findOne({randomString: string}).exec()
}
const deleteRandomString = (string)=>{
    return session.deleteOne({randomString: string}).exec();
}
const saveRandomString = (string,account_id)=>{
    try{
        session.create({randomString: string,account_id: account_id});
    }catch(err){
        console.log(findRandomString(string));
    }
}



const findingRandomString = sp(findRandomString);
const deletingRandomString = sp(deleteRandomString);
const savingRandomString = sp(saveRandomString);


// console.log(deletingRandomString("lalala"));
// console.log(findingRandomString("lalala"))

// const findingARandomString = (string) => {
//     const result = findingRandomString(string)
//     if(result.randomString === string){
//         return result.randomString;
//     }else{
//         return false; 
//     }
// }
// const deletingARandomString = (string) => {
//     const result = deletingRandomString(string);
//     if(result.deletedCount === 1){
//         return true;
//     }else{
//         return false; 
//     }
// }
// const savingARandomString = (string,account_id) => {
//     const result = savingRandomString(string,account_id);
//     if(result.randomString === string){
//         return true;
//     }else{
//         return false;
//     }
// }

// // ---------- LEVEL 1.2: Making each JWT token unique: random string ----------
// const createRandomString = () => {
//     return randomString.generate(30);
// }

// // ------------ LEVEL 1.3: JWT operations --------------------------------------
// const createJWTToken = (string,account_id) => {
//     const JWTtoken = jwt.sign({randomString: string,account_id: account_id},JWT_SECRET,algorithm);
//     return JWTtoken;
// }

// const getRandomStringFromJWTToken = (token) => {
//     try{
//         const verificationResult = jwt.verify(token,JWT_SECRET);
//         return verificationResult.randomString
//     }catch(err){
//         return false;
//     }
// }

// const getAccountIDFromJWTToken = (token) => {
//     try{
//         const verificationResult = jwt.verify(token,JWT_SECRET);
//         return verificationResult.account_id;
//     }catch(err){
//         return false
//     }
// }

// // ---------- LEVEL 2: COMBINING THE BASE COMPONENTS TO CREATE MID LEVEL OPERATION --------------
// const storeRandomString = (string,account_id) => {
//     const operationResult = savingARandomString(string,account_id);
//     if(operationResult){
//         console.log("storeRandomString: successful storage of string in database.")
//         return true;
//     }else{
//         console.log("storeRandomString: Failed to store string in database.")
//         return false;
//     }
// }

// //  -------------LEVEL 3: SESSION VERIFICATION OPERATION ------------
// const createSession = (account_id) => {
//     console.log(JWT_SECRET)
//     const randomString = createRandomString();
//     const storeRandomStringResult = storeRandomString(randomString,account_id);
//     if(storeRandomString){
//         const JWTToken = createJWTToken(randomString,account_id);
//         console.log("CREATE SESSION: Success - CREATED JWTTOKEN")
//         return JWTToken;
//     }else{
//         console.log("CREATE SESSION: Error - FAILED TO STORE STRING IN RANDOM STRING IN DATABASE.")
//         return false;
//     }
// }

// const verifySession = (token) => {
//     const randomString = getRandomStringFromJWTToken(token);
//     if(randomString){
//         const databaseString = findingARandomString(randomString);
//         if(databaseString){
//             console.log("VERIFY SESSION: Success - Session exist in database.")
//             return true;
//         }else{
//             console.log("VERIFY SESSION: Error - Session does not exist in database.")
//             return false;
//         }
//     }else{
//         console.log("VERIFY SESSION: Error - Token cannot be opened.");
//         return false;
//     }
// }

// const destroySession = (token) => {
//     if(verifySession(token)){
//         const randomString = getRandomStringFromJWTToken(token);
//         const deletingOutcome = deletingARandomString(randomString);
//         if(deletingOutcome){
//             console.log("DESTROY SESSION: Success - randomString deleted from the database.")
//             return true;
//         }else{
//             console.log("DESTROY SESSION: Error - Failed to delete randomString from database.")
//             return false;
//         }
//     }else{
//         console.log("DESTROY SESSION: Error - session does not exist.")
//         return false;
//     }
// }

// module.exports = {
//     createSession,
//     verifySession,
//     destroySession,
//     storeRandomString,
//     createJWTToken,
//     getRandomStringFromJWTToken,
//     getAccountIDFromJWTToken,
//     createRandomString,
//     savingARandomString,
//     findingARandomString,
//     deletingARandomString
// }



/*

    SCRIPT STRUCTURE
        All functions needed to implement JWT in your app.

    1. BASE COMPONENTS
        1.1 Mongoose functions
            a. findingARandomString(<string>)       -> Return values: <success>,<failure>       -> "bob", false
            b. deletingARandomString(<string>)      -> Return values: <success>,<failure>       -> true, false
            c. savingARandomString(<string>)        -> Return values: <success>,<failure>       -> true, false
        1.2 Create random string
            a. createRandomString()                 -> Return values: <string>
        1.3 JWT operations                          
            a. createJWTToken(<string>)             -> Return values: <string/token>
            b. getRandomStringFromJWTToken(<token>)                -> Return values: <success>,<failure>       -> <string>,false
            c. getAccountIDFromJWTToken(<token>)    
    2. MID LEVEL OPERATION
        1.1 storeRandomString(<string>)             -> Return values: <success>,<failure>       -> true, false

    3. SESSION OPERATION
        1.1 createSession()                         -> Return values: <success>,<failure>       -> <string/token>, false
        1.2 verifySession(token)                    -> Return values: <success>,<failure>       -> true, false
        1.3 destroySession(token)                   -> Return values: <success>,<failure>       -> true, false

*/