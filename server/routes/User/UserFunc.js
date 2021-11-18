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
  const { email } = req.params;
  try {
    const user = await User_Model.find({ email: email });

    res.status(200).send(user);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};

module.exports.setlayout = (req, res) => {
  const { email, grid } = req.body;

  User_Model.findOneAndUpdate({email:email},
    {$set: {layout:grid}}, {useFindAndModify: false},
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};
module.exports.updaterestaurantName = (req, res) => {
  const { email, restaurantName } = req.body;
  User_Model.findOneAndUpdate(
    { email: email },
    { restaurantName: restaurantName },
    { runValidators: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};

module.exports.updaterestaurantAddress = (req, res) => {
  const { email, restaurantAddress } = req.body;
  User_Model.findOneAndUpdate(
    { email: email },
    { restaurantAddress: restaurantAddress },
    { runValidators: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};
module.exports.updatelogo = async (req, res) => {
  const { email, logo } = req.body;

  User_Model.findOneAndUpdate(
    { email: email },
    { logo: logo },
    { runValidators: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};
