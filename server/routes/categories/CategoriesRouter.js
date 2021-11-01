const express =require('express');
const router=express.Router();
const CategoriesFunc=require("./CategoriesFunc");

router.post('/addcategory',CategoriesFunc.addcategory);
router.get('/getcategories/:email',CategoriesFunc.getcategories);
router.delete('/removecategory/:id',CategoriesFunc.removecategory);
module.exports=router;