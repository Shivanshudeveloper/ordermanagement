const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
    email:{
        type:String,
    },
     adminEmail:{
        type:String
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
    title:{
            type:String
    },
    status:{
        type:String
    },
    payment:{
        type:String
    },
    totalamount:{
        type:Number
    },
    type:{
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