const express = require("express");

const router = express.Router();

const UserFunc = require("./UserFunc");

router.post("/register", UserFunc.adduser);
router.get("/getuser/:email", UserFunc.getuser);
router.patch("/setlayout", UserFunc.setlayout);
router.patch("/updaterestaurantName", UserFunc.updaterestaurantName);
router.patch("/updaterestaurantAddress", UserFunc.updaterestaurantAddress);
router.patch("/updatelogo", UserFunc.updatelogo);
module.exports = router;
