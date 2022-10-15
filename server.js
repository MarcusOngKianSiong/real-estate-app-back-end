const express = require("express")
const app = express()

app.get('/',(req,res)=>{
    res.send("TESTING CONNECTION???")
})

app.listen(22,()=>{
    console.log("Listening to port 22 for incoming request......")
})