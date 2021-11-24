const express=require('express');
const router=express.Router();
const OrdersFunc=require("./OrdersFunc");

router.post('/addorder',OrdersFunc.addorder);
router.patch("/updateorder",OrdersFunc.updateorder);
router.patch('/updatependingorder',OrdersFunc.updatependingorder);
router.delete("/deleteorder",OrdersFunc.deleteorder);
router.get('/getorders/:email',OrdersFunc.getorders);
router.get('/getpendingorder/:email',OrdersFunc.getpendingorder);
router.get('/getrevenue/:email',OrdersFunc.getrevenue);

module.exports=router;