const database = require('./database.js')
const randomString = require('randomstring')
require('dotenv').config({path: './.env'});
const jwt = require('jsonwebtoken');
const sp = require('synchronized-promise')
// NOTE!!!! Synchronized-promise cannot be used on "create" mongoose function
const algorithm = {algorithm: 'HS256'};

const findingRecord = sp((randomString)=>{
    return database.session.find({randomString: randomString})
})

const deleteRecord = sp((account_id)=>{
    return database.session.deleteOne({account_id: account_id});
})

const createSession = (account_id) => {
    const string = randomString.generate(30);
    const JWTtoken = jwt.sign({randomString: string,account_id: account_id},"fuyvewvbwfbviewhvewrjvifnvodfvbwfvibwfvbfivbewi",algorithm);    
    database.session.create({randomString: string,account_id: account_id},(err,session)=>{
        if(err){
            console.log("ERROR IN CREATING SESSION")
        }else{
            console.log("SESSION CREATED: ",session)
        }
    })
    return JWTtoken;
}

const verifyAndIdentify = (token) => {
    // Verify = unpacking token + session exist
    // Identify = account id
    let unpacked_token = null;
    // Unpacking token
    try{
        unpacked_token = jwt.verify(token,"fuyvewvbwfbviewhvewrjvifnvodfvbwfvibwfvbfivbewi")
    }catch(err){
        console.log("token cannot be unpacked: ",err)
        return false
    }

    // Check if session exist
    if(findingRecord(unpacked_token.randomString).length > 0){
        return unpacked_token.account_id;
    }else{
        console.log("session does not exist.")
        return false
    }
    

}

// console.log(createSession("something"))


const deleteSession = (token)=>{
    const identity = verifyAndIdentify(token);
    if(identity){
        if(deleteRecord(identity).deletedCount === 1){
            console.log("Session deleted.")
            return true;
        }
    }else{
        return false
    }
}

// console.log(createSession("bobby"))



module.exports = {createSession,deleteSession,verifyAndIdentify}