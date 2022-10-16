const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
},{timestamps: true}) 

//|| 'mongodb://localhost:27017/'+'real_estate_app' 
const mongoURL = "mongodb+srv://marcus:Meowingtons-1@cluster0.fghacsb.mongodb.net/real_estate_app?retryWrites=true&w=majority" 
const db = mongoose.connection;

mongoose.connect(mongoURL);
mongoose.connect(mongoURL,{ useNewUrlParser: true})

// Connection Error/Success
// Define callback functions for various events
db.on( 'open' , ()=>{
    console.log('Connection made!');
});

const account = mongoose.model('account',accountSchema)

const seedAccount = {
    email: 'tim@gmail.com',
    name: 'tim',
    password: 'ha'
}

account.create(seedAccount,(error,account)=>{
    if(error){
        console.log("Error in creating account....:",error)
    }else{
        console.log("account created: ",account)
    }
})