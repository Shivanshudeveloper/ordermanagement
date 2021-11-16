const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    item:{
        type: String,
        required: true
    },
    discount:{
        type: String
    },
    price:{
        type: String,
        required: true 
    },
    userID:{
        type:String,
        required:false,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    restaurantName:{
        type:String,
        required:true
      },
    image:{
        type:String
    },
    description:{
        type:String
    }

    //email name
    
})
const Menu = mongoose.model('Menu', MenuSchema)
module.exports = Menu;