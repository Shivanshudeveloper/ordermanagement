const express =require('express');
const router=express.Router();

const UserFunc=require('./UserFunc');

router.post('/register',UserFunc.adduser);
router.get('/getuser/:email',UserFunc.getuser);

module.exports=router;