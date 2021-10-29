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
    }
    
})
const Menu = mongoose.model('Menu', MenuSchema)
module.exports = Menu;