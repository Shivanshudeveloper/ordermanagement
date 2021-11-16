const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    category: {
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
    icon:{
type:String
    },
    restaurantName:{
        type:String,
        required:true
      }
})
const Categories = mongoose.model('Categories', CategoriesSchema)
module.exports = Categories;