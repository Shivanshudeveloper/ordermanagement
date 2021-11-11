const Customers_Model=require("../../models/Customers");
module.exports.getcustomer = async (req, res) => {
  const { id } = req.query;
 
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



