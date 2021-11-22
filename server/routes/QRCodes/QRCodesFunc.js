const QRCodes_Model = require("../../models/QRCodes");

module.exports.addQRCode = async (req, res) => {
  const { qrCode, email, title,type } = req.body;
  try {
    const QRCode = new QRCodes_Model({
      email,
      title,
      qrCode,
      type
    });

    await QRCode.save();
    res.status(200).send(QRCode);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};
module.exports.updateQRCode = async (req, res) => {
  const { qrCode, email, title, id,type } = req.body;

  QRCodes_Model.findOneAndUpdate(
    { _id: id },
    { title: title, qrCode: qrCode,type:type },
    { runValidators: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};
module.exports.getQRCodes = async (req, res) => {
  try {
    const data = await QRCodes_Model.find({ email: req.params.email });

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
};

module.exports.removeQRCode = (req, res) => {
  QRCodes_Model.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (!err) {
      res.status(200).send(docs);
    } else {
      res.status(400).json(`Error: ${err}`);
    }
  });
};
