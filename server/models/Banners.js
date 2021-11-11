const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  
    email:{
        type:String,
        required:true,
  
    },
    name:{
        type:String
    },
   banner:{
           type:String
   },
   coupon:{
       type:Object
   },
   TandC:{
       type:String
   }
  
})
const Banners = mongoose.model('Banners', BannerSchema)
module.exports = Banners;