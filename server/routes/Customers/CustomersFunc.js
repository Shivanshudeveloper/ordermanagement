const Customers_Model=require("../../models/Customers");
module.exports.getcustomer = async (req, res) => {
  const { id } = req.params;
 
    try {
      const customer = await Customers_Model.findOne({ _id: id });
     if(customer)
        res.send(customer);
    else
        res.status(404).send({message:"Not Registered"});
    } catch (err) {
      res.status(500).send(err);
    }

};

module.exports.getallcustomers=async(req,res)=>{
  const customers=await Customers_Model.find({});
  res.send(customers);
}
module.exports.addcustomer=async(req,res)=>{
  const {email,firstName,lastName}=req.body;
  console.log(email,firstName,lastName);
  try {
    const customer = await Customers_Model.create({ email, firstName, lastName });
  
      res.send(customer);

  } catch (err) {
       if(err.code===11000){
               if(err.keyValue.email){
                       res.status(404).send({message:"Already Exists"});
               }else
               res.status(500).send(err);
       }else
       res.status(500).send(err);
  }
}




