
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

fetch('http://localhost:8080/showbuyinterest?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kb21TdHJpbmciOiJvdGY1eVJCVVV5V2JPMnlGTXJzenR1dHEyN3RGcFEiLCJhY2NvdW50X2lkIjoiNjM0Yjk4YmVhNTI2NjVlODUxOTFlZDQyIiwiaWF0IjoxNjY3MjQ0MzM1fQ.Wd6z7UNVfNnYJSxPpPqsnNGvF2cTkB3yj4C_32leYPc')
.then(res=>{
    return res.json()
})
.then(res=>{
    console.log(res)
})

