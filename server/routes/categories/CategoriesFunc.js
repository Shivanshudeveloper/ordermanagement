const Categories_Model = require("../../models/Categories");

module.exports.addcategory = async (req, res) => {
  const { category } = req.body;
  try {
    const categories = new Categories_Model({
      category,
    });
    await categories.save();
    res.status(200).send(categories);
  } catch (err) {
    res.status(400).json({ err: err });
    console.log(err);
  }
};

module.exports.getcategories = async (req, res) => {
  try {
    const data = await Categories_Model.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
};

module.exports.removecategory = (req,res) => {
  Categories_Model.deleteOne({ _id: req.params.id }, (err,docs)=> {
    if (!err) {
      res.status(200).send(docs);
    } else {
      res.status(400).json(`Error: ${err}`);
    }
  });
};
