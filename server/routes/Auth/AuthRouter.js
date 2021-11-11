const express=require('express');
const AuthFun=require("./AuthFunc");
const router=express.Router();

router.post('/signin',AuthFun.signin);
router.post('/register',AuthFun.register);
router.post('/logout',AuthFun.logout);
router.get('/verify',AuthFun.verify);

module.exports=router;