const Customers_Model=require("../../models/Customers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretJWT=process.env.secretJWT;
const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id },toString(secretJWT), {
    expiresIn: maxAge,
  });
}


module.exports.register = async (req, res) => {
  const { email, firstName,lastName, password } = req.body;

  let pass = await bcrypt.hash(password, 10);
  try {
    const customer = await Customers_Model.create({ email, firstName, lastName, password: pass });
  
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
};
module.exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customers_Model.findOne({ email: email });
  
  try{
        if (customer) {
                const isYes = await bcrypt.compare(password, customer.password);
            
                if (isYes) {
                 const token = createToken(customer._id);
                  const date = new Date();
                  res.cookie("jwt", token, { maxAge: maxAge * 1000,httpOnly: false });
                  res.send({ message: "successfully signed in", success: true, customer: customer });
                } else {
                  res.status(401).send({ message: "Password is Incorrect", success: false,customer:null});
                }
              } else {
                res.status(404).send({ message: "Please Register first", success: false,customer:null});
              }
  }catch(err){
          res.send(err);
  }
  
};

module.exports.logout = (req, res) => {
    res.cookie("jwt", null, { maxAge:1, 
        httpOnly: false }
      );

  res.status(200).json('User Logged out');
 
};

module.exports.verify = (req, res) => {
        const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token,toString(secretJWT), (err, decored) => {
      if (!err) {
        res.send({ access: true, id: decored.id});
      } else {  
        res.send({ access: false,id:null});
      }
    });
  } else {
    res.send({ access: false ,id:null});
  }
};