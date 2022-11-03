const database = require('../src/database.js')
const sp = require('synchronized-promise')

const createAccount = (accountDetails)=>{

    return database.account.create(accountDetails)
    
}

let creatingAccount = sp(createAccount);

module.exports = {createAccount}

