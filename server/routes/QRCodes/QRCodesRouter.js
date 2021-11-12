const express =require('express');
const router=express.Router();
const QRCodesFunc=require("./QRCodesFunc");

router.post('/addQRCode',QRCodesFunc.addQRCode);
router.get('/getQRCodes/:email',QRCodesFunc.getQRCodes);
router.delete('/removeQRCode/:id',QRCodesFunc.removeQRCode);
module.exports=router;