const express = require("express")
const app = express()
const cors = require('cors')
const registration = require('./controllers/registration.js')
const sp = require('synchronized-promise')
const database = require('./src/database.js')
const accountOperation = require('./src/accountOperation.js')
const jwt = require('./src/jwt.js')
const login = require('./controllers/login.js')
const ImageKit = require('./controllers/imagekit.js')
const sellData = require('./controllers/sellData.js')
const buyData = require('./controllers/buyData.js')

app.use(cors({
    origin: '*'
}))

app.get('/imagekitauth',(req,res)=>{
    console.log("------------PROCESSING IMAGEKIT AUTHENTICATION---------------")
        const result = ImageKit.imageKitAuthentication()
        res.send(result);
})

app.delete('/deleteimage',(req,res)=>{
    const imageName = req.query.imageName;
    const result = ImageKit.deleteImage(imageName)
    result.then(res=>{
        console.log("this: ",res)
    })
    res.send({outcome: "testing"})
})

app.get('/register',(req,res)=>{
    console.log("ENACTING REGISTER OPERATION.......");
    const registrationData = req.query;
    database.account.find({},async (err,accounts)=>{
        // STEP 1: CHECK REGISTRATION DATA AGAINST CRITERIA
        const registrationDataCriteriaCheckOutcome = registration.checkRegistrationData(registrationData,accounts);
        console.log("WHAT? - ",registrationDataCriteriaCheckOutcome)        
        if (registrationDataCriteriaCheckOutcome === "pass"){
            // STEP 2: STORE ACCOUNT IN ACCOUNT DATABASE
            delete registrationData["password_confirmation"];
            console.log(registrationData);
            // STEP 3: Create account in database
            database.account.create(registrationData, (err,outcome)=>{
                // STEP 4: Create JWT Token using account id
                const account_id = outcome.id;
                const JWTToken = jwt.createSession(account_id);
                console.log("CHECKING JWT TOKEN: ",JWTToken);
                // STEP 5: Send jwt to the front-end
                res.send({"outcome": "YOU PASSED THE REGISTRATION DATA CRITERIA!!!",'JWTToken': JWTToken});
            });
        }
        if(registrationDataCriteriaCheckOutcome !== "pass"){
            res.send(registrationDataCriteriaCheckOutcome);
        }
    })
})

app.delete('/logout',(req,res)=>{
    // Remove the randomstring from the database
    const token = req.query.token
    console.log("CHECKING TOKEN: ",token)
    if(token === "null"){
        res.send({closingSessionStatus: true})
    }

    if(jwt.deleteSession(token)){
        res.send({closingSessionStatus: true}); 
    }else{
        res.send({closingSessionStatus: false});
    }
})

app.get('/login',(req,res)=>{
    console.log("LOGGING IN....")
    const loginData = req.query;
    console.log("Checking query: ",loginData)
    const JWTToken = login.checkLoginAndReturnJWTToken(loginData)
    if (JWTToken){
        res.send({outcome: "Login successful",JWTToken: JWTToken})
    }else{
        res.send({error: "Account not found."})
    }
})

app.get('/buyData',(req,res)=>{  
    console.log("-------------GETTING BUY DATA-------------")
    buyData.allLocations().then(locations=>{
        res.send(locations)
    })
    
})

// Create a sell order
app.get('/sell',async (req,res)=>{

    console.log("STORING SELL DATA......")
    const data = req.query;
    const verificationResult = jwt.verifyAndIdentify(data.token)    // If pass, it is account_id

    if(verificationResult){
        delete data.token;
        data["account_id"] = verificationResult;
        console.log("verficiation result: ",verificationResult)
        console.log("query: ",data)
        await database.selling.create(data)
        database.selling.find(data,(err,data)=>{
            if(err){
                console.log("ERROR IN SAVING PROPERTY DATA.... ")
                res.send({outcome: "error in data"})
            }else{
                console.log("SUCCESS IN SAVING PROPERTY DATA: ",data)
                res.send({outcome: "success"})
            }
        })
    }else{
        res.send({outcome: "error in verification token...."})
    }
    
    // if(verificationResult){
    //     console.log("Data retrieved.....");
    //     delete data.token
    //     // Take data and store it.
    //     res.send("Received...");
    // }else{
    //     res.send({outcome: "something wrong"})
    // }
})

// Show all the sell order of the user
app.get('/showsell',(req,res)=>{
    const token = req.query.token;
    const verificationResult = jwt.verifyAndIdentify(token);
    if(verificationResult){
        database.selling.find({account_id: verificationResult},(err,result)=>{
            if(err){
                res.send({"outcome": "error in finding data"})
            }else{
                res.send(result);
            }
        })
        // if(result){
        //     res.send(result)
        // }else{
            // res.send({outcome: "error"})
        // }
    }else{
        res.send({"outcome": "token error"});
    }
})

// Show property on sale
app.get('/showsales',(req,res)=>{
    
})

app.get('/createbuyinterest',(req,res)=>{
    console.log("--------Creating buy interest-----------")
    const query = req.query
    const verificationResult = jwt.verifyAndIdentify(query.token);
    if(verificationResult){
        buyData.createBuyInterest(verificationResult,query._id)
        res.send({outcome: "success"})
    }else{
        res.send({outcome: "token error"});
    }
})

app.get('/showbuyinterest',(req,res)=>{
    console.log("--------_SHOW BUY INTERESTS-------------")
    const query = req.query;
    const verificationResult = jwt.verifyAndIdentify(query.token);
    if(verificationResult){
        buyData.showAllBuyInterest(verificationResult).then(response=>{
            const propertyIDs = [];
            response.sellingPropertyIDs.forEach(item=>{
                if(item !== null && item !== ""){
                    propertyIDs.push(item)
                }
            })
            console.log(propertyIDs)
            database.selling.find({_id: {$in: propertyIDs}},(err,outcome)=>{
                console.log("this: ",outcome)
                res.send(outcome)
            })    
        })
    }else{
        res.send({outcome: "error in token"})
    }

})

app.listen(8080,()=>{
    console.log("Listening to port 8080 for incoming request......")
})