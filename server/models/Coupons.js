const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  
    email:{
        type:String,
        required:true,
  
    },
    couponCode:{
        type:String
    },
   discount:{
           type:String
   }
  
})
const Coupons = mongoose.model('Coupons', CouponSchema)
module.exports = Coupons;