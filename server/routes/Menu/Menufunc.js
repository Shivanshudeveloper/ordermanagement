const Menu_Model = require("../../models/Menu");

module.exports.addmenu = async (req, res) => {

  try {
    const menu = new Menu_Model(req.body);
    await menu.save();
    res.status(200).send(menu);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};

module.exports.getmenu = async (req, res) => {
  const {email}=req.params;
  
  
  try {
    const data = await Menu_Model.find({email:email});

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
};
module.exports.removemenu = (req,res) => {
  Menu_Model.deleteOne({ _id: req.params.id }, (err,docs)=> {
    if (!err) {
      res.status(200).send(docs);
    } else {
      res.status(400).json(`Error: ${err}`);
    }
  });
};
module.exports.updatemenu = (req, res) => {
  const { id } = req.params;

  Menu_Model.findOneAndUpdate({_id:id},
    {$set: req.body}, {useFindAndModify: false},
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send(doc);
    }
  );
};