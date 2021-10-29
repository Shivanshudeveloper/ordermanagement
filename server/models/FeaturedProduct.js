const mongoose = require('mongoose');

const usersFeaturedProductsSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    displayImage: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const featuredproducts = mongoose.model('featuredproducts', usersFeaturedProductsSchema)
module.exports = featuredproducts