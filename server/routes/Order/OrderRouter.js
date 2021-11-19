const express=require('express');
const router=express.Router();
const OrdersFunc=require("./OrdersFunc");

router.post('/addorder',OrdersFunc.addorder);
router.patch("/updateorder",OrdersFunc.updateorder);
router.get('/getorders/:email',OrdersFunc.getorders);
router.get('/getrevenue/:email',OrdersFunc.getrevenue);
module.exports=router;