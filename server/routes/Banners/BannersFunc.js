const Banners_Model = require("../../models/Banners");

module.exports.addbanner = async (req, res) => {
  const { banner, email,name,coupon,TandC} = req.body;
  try {
    const Banner = new Banners_Model({
      email,
      banner,
      name,
      coupon,
      TandC
    });

    await Banner.save();
    res.status(200).send(Banner);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};
module.exports.updatebanner = async (req, res) => {
   const {id}=req.params;
   
   try{
    const doc = await Banners_Model.findOneAndUpdate({_id:id});

    if(req.body?.TandC){
      doc.TandC=req.body?.TandC;
    }
    

      res.send(doc);
   }catch(err){
     res.send(err);
   }
};
module.exports.getbanners = async (req, res) => {
  try {
    const data = await Banners_Model.find({ email: req.params.email });

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
};



module.exports.removebanner = (req, res) => {
  Banners_Model.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (!err) {
      res.status(200).send(docs);
    } else {
      res.status(400).json(`Error: ${err}`);
    }
  });
};
