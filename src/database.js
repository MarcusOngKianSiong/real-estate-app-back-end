const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
},{timestamps: true}) 

const sessionSchema = new mongoose.Schema({
    randomString: {type: String,required: true,unique: true},
    account_id: {type: String, required: true, unique: true}
})

const sellingSchema = new mongoose.Schema({
    account_id: {type: String, required: true},
    images: {type: String},
    lantitude: {type: String, required: true},
    longitude: {type: String, required: true},
    address: {type: String, required: true},
    price: {type: String, required: true},
    contact: {type: String, required: true},
    comments: {type: String, required: true}
})

const buyingSchema = new mongoose.Schema({
    account_id: {type: String, required: true},
    sellingPropertyIDs: []
})

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
const session = mongoose.model('session',sessionSchema)
const selling = mongoose.model('selling',sellingSchema)
const buying = mongoose.model('buying',buyingSchema)
module.exports = {account,session,selling,buying}



const seedAccount = {
    email: 'tim@gmail.com',
    name: 'tim',
    password: 'ha'
}



// account.create(seedAccount,(error,account)=>{
//     if(error){
//         console.log("Error in creating account....:",error)
//     }else{
//         console.log("account created: ",account)
//     }
// })