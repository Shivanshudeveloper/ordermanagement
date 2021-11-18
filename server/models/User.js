const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  layout: {
    type: Boolean,
    default: true,
  },
  logo: {
    type: String,
    default: "",
  },
  restaurantAddress:{
      type:String,
      default:""
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const user = mongoose.model("user", userDataSchema);
module.exports = user;
