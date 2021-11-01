const express =require('express');
const router=express.Router();

const MenuFunc=require('./Menufunc');

router.get('/getmenu/:email',MenuFunc.getmenu);
router.post('/addmenu',MenuFunc.addmenu);
module.exports=router;