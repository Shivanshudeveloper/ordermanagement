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
