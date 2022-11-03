const database = require('../src/database.js');
const sp = require('synchronized-promise');
const jwt = require('../src/jwt.js');
const { TokenExpiredError } = require('jsonwebtoken');
const { get } = require('mongoose');

const checkLogin = sp(async (loginData) => {
    const outcome = await database.account.findOne(loginData)
    return outcome;
})

const checkLoginAndReturnJWTToken = (loginData) => {
    const outcome = checkLogin(loginData);
    if (outcome){
        const JWTToken = jwt.createSession(outcome.id)
        return JWTToken;
    }else{
        console.log("CHECK LOGIN: ERROR")
        return false;
    }
}

module.exports = {checkLoginAndReturnJWTToken}