const database = require('../src/database.js');

const addOneBuyItem = async (buyerID,propertyID) => {
    const doc = await database.buying.findOne({account_id: buyerID});
    doc.sellingPropertyIDs.push(propertyID);
    await doc.save();
}

const allLocations = async () => {
    return await database.selling.find({})
}

const createBuyInterest = async (buyerID,propertyID) => {
    console.log(propertyID)
    database.buying.find({account_id: buyerID},(err,result)=>{
        if(err){
            return false;
        }else{
            if(result.length === 0){
                database.buying.create({account_id: buyerID,sellingPropertyIDs: [propertyID]})
                
            }else{
                addOneBuyItem(buyerID,propertyID)
            }
            return true;
        }
    })
}

const showAllBuyInterest = async (account_id)=>{
    const obj = await database.buying.findOne({account_id: account_id})
    return obj; 
    // data.then(res=>{
    //     console.log(res)
    // })
    // const buyInterest = await database.selling.find({_id: {$in: listOfBuyInterestIDs}})
    // return buyInterest;
}

module.exports = {allLocations,createBuyInterest,showAllBuyInterest}