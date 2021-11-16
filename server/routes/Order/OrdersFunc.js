const Order_Model=require("../../models/Orders");

module.exports.addorder=async(req,res)=>{
  const {tablename,orders,email,firstName,lastName}=req.body;
  try{  

        const order=await Order_Model.create({
                email:email,
                tablename:tablename,
                orders:orders,
                firstName:firstName,
                lastName:lastName
        })
        await order.save();
        res.send(order);

  }catch(err){
          res.send(err);
  }
   
}
module.exports.getorders=async(req,res)=>{
  const {email}=req.params;

  try{
        const orders=await Order_Model.find({email:email}); 
        res.send(orders);
  }catch(err){
        res.send(err);
  }
}