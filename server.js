const express = require("express")
const app = express()

app.get('/',(req,res)=>{
    res.send('SENDING SOMETHING TO THE FRONT END!!!')
})

app.listen(8080,()=>{
    console.log("Listening to port 8080 for incoming request......")
})