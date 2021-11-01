const User_Model = require("../../models/User");

module.exports.adduser = async (req, res) => {
  try {
    const user = new User_Model(req.body);
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};
module.exports.getuser = async (req, res) => {
const {email}=req.params;
  try {
    const user =  await User_Model.find({email:email});

    res.status(200).send(user);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};
