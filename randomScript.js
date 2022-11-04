
const buyData = require('./controllers/buyData.js')
const database = require('./src/database.js')

// const oneByOne = async (value) => {
//     return await database.selling.find({_id: value})
// }

// const something = buyData.showAllBuyInterest("634b98bea52665e85191ed42").then(res=>{
//     const propertyIDs = []
//     res.sellingPropertyIDs.forEach(item=>{
//         if(item !== null && item !== ""){
//             propertyIDs.push(item)
//         }
//     })
//     console.log(propertyIDs)
//     database.selling.find({_id: {$in: propertyIDs}},(err,outcome)=>{
//         console.log("this: ",outcome)
//         return outcome
//     })    
// })

fetch('https://172.31.27.39:8080/buyData')
.then(res=>{
    return res.json()
})
.then(res=>{
    console.log(res)
})
