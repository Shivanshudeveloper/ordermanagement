const express=require('express');
const router=express.Router();
const customerFun=require("./CustomersFunc");

router.get('/getcustomer/:id',customerFun.getcustomer);
router.get('/getallcustomers',customerFun.getallcustomers);

module.exports=router;