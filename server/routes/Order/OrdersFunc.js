const Order_Model=require("../../models/Orders");

module.exports.addorder=async(req,res)=>{
  const {tablename,orders,email,firstName,lastName,adminEmail,status}=req.body;
  try{  

        const order=await Order_Model.create({
                email:email,
                tablename:tablename,
                orders:orders,
                firstName:firstName,
                lastName:lastName,
                adminEmail:adminEmail,
                status:status
        })
        await order.save();
        res.send(order);

  }catch(err){
          res.send(err);
  }
   
}
module.exports.updateorder=async(req,res)=>{
      const {id,status}=req.query;
   
      try{
        const order = await Order_Model.findOne({ _id: id });
      order.status=status;
 await order.save();
       res.send(order);
      }catch(err){
        res.send(err);
      }
    }
module.exports.getorders=async(req,res)=>{
  const {email}=req.params;

  try{
        const orders=await Order_Model.find({adminEmail:email}); 
        res.send(orders);
  }catch(err){
        res.send(err);
  }
}