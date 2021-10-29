const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
})
const Categories = mongoose.model('Categories', CategoriesSchema)
module.exports = Categories;