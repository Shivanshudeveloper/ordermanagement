const mongoose=require('mongoose');
const {isEmail }=require('validator');

const CustomerSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
       validate:[
         isEmail,
       'Email is not valid']
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    password:{
        type:String
    },
    createdAt:
    {
        type:Date,
        default:Date.now
    }
});
const Customers = mongoose.model('Customers', CustomerSchema)
module.exports = Customers;