const express =require('express');
const router=express.Router();
const BannnersFunc=require("./BannersFunc");

router.post('/addbanner',BannnersFunc.addbanner);
router.patch('/updatebanner/:id',BannnersFunc.updatebanner);
router.get('/getbanners/:email',BannnersFunc.getbanners);
router.delete('/removebanner/:id',BannnersFunc.removebanner);
module.exports=router;