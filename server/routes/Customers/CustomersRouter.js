const express=require('express');
const router=express.Router();
const customerFun=require("./CustomersFunc");

router.get('/getcustomer',customerFun.getcustomer);

module.exports=router;