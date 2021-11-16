const mongoose=require('mongoose');


const OrderSchema=new mongoose.Schema({
    email:{
        type:String,
    },
    orders:{
        type:Array
    },
    firstName:{
            type:String
    },
    lastName:{
            type:String
    },
    tablename:{
            type:String
    },
    createdAt:
    {
        type:Date,
        default:Date.now
    }
});
const Orders = mongoose.model('Orders', OrderSchema)
module.exports = Orders;