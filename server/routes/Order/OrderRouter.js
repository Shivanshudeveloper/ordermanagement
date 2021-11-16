const express=require('express');
const router=express.Router();
const OrdersFunc=require("./OrdersFunc");

router.post('/addorder',OrdersFunc.addorder);
router.get('/getorders/:email',OrdersFunc.getorders);

module.exports=router;