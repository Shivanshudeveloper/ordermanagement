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




