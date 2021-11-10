const express =require('express');
const router=express.Router();
const CouponsFunc=require("./CouponsFunc");

router.post('/addcoupon',CouponsFunc.addCoupon);
router.get('/getcoupons/:email',CouponsFunc.getCoupons);
router.delete('/removecoupon/:id',CouponsFunc.removeCoupon);
module.exports=router;