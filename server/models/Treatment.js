const mongoose = require('mongoose');

const treatmentschema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    justification: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    goals: {
        type: String,
        required: true
    },
    estComp1: {
        type: String,
        required: true
    },
    obj: {
        type: String,
        required: true
    },
    strat: {
        type: String,
        required: true
    },
    estComp2: {
        type: String,
        required: true
    },
    freq: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const treatment = mongoose.model('treatment', treatmentschema)
module.exports = treatment