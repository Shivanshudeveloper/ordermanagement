const Coupons_Model = require("../../models/Coupons");

module.exports.addCoupon = async (req, res) => {
  const { couponCode, email,discount } = req.body;
  try {
    const Coupon = new Coupons_Model({
      email,
      couponCode,
      discount
    });

    await Coupon.save();
    res.status(200).send(Coupon);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};

module.exports.getCoupons = async (req, res) => {
  try {
    const data = await Coupons_Model.find({ email: req.params.email });

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
};

module.exports.removeCoupon = (req, res) => {
        Coupons_Model.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (!err) {
      res.status(200).send(docs);
    } else {
      res.status(400).json(`Error: ${err}`);
    }
  });
};
