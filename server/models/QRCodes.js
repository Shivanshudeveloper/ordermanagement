const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  
    email:{
        type:String,
        required:true,
  
    },
    title:{
        type:String,

    },
    type:{
        type:String
    },
   qrCode:{
           type:String
   }
  
})
const QRCodes = mongoose.model('QRCodes', QRCodeSchema)
module.exports = QRCodes;