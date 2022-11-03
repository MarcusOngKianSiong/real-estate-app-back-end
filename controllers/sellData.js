const { default: mongoose } = require("mongoose")
const database = require('../src/database.js')
const createNewSell = (data) => {
    database.selling.create(data)
}

const retrieveSellPropertyOfUser = (account_id) => {
    console.log("---------Retrieve property sold by user-------")
    
}

module.exports = {retrieveSellPropertyOfUser}