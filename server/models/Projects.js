const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    category: {
        type: String,
    },
    shelf: {
        type: Boolean,
    },
    image: {
        type: Boolean,
    },
    inventory: {
        type: Boolean,
    },
    productImage: {
        type: Boolean,
    },
    title: {
        type: String,
    },
    categoryLocation: {
        type: String,
    },
    content: {
        type: String,
    },
    notes: {
        type: String,
    },
    file1: {
        type: String,
    },
    file2: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const projects = mongoose.model('project', projectSchema)
module.exports = projects