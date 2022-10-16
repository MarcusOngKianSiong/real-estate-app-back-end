const express = require("express")
const app = express()

app.get('/',(req,res)=>{
    res.render('something')
})

app.listen(8080,()=>{
    console.log("Listening to port 8080 for incoming request......")
})