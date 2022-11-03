const database = require('./database.js')
const sp = require('synchronized-promise')



const findAccount = (email) => {
    const result = database.account.find(email).exec(); 
    return result;
}

const findingAccount = sp(findAccount)

const getAccountID = (email) => {
    const result = findingAccount(email)
    return result[0].id
}

module.exports = {getAccountID}
