const express = require("express");
const router = express.Router();
const CategoriesRouter=require('./categories/CategoriesRouter');
const MenuRouter=require("../routes/Menu/MenuRouter");
const UserRouter=require("../routes/User/UserRouter");
const BannersRouter=require("../routes/Banners/BannersRouter");
const CouponsRouter=require("../routes/Coupons/CouponsRouter");
const AuthRouter=require("../routes/Auth/AuthRouter");
const CustomerRouter=require("../routes/Customers/CustomersRouter");
const QRCodeRouter=require("../routes/QRCodes/QRCodesRouter");
const OrderRouter=require("../routes/Order/OrderRouter");
const { v4: uuidv4 } = require("uuid");
// Getting Module
const Products_Model = require("../models/Products");
const MainStore_Model = require("../models/MainStore");


const stripe = require("stripe")(
  "sk_test_51JHsVhHTwp1a1ssg6tNelx0wUKQoKhxbr1S6yajKtX1ppZUpv0sNQAJ4A0Yb9yGNMwm2tZ1efaarIykDm21zNWWd00lNcFUkc3"
);

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

// TEST
// @GET TEST
// GET
router.get("/test", (req, res) => {
  res.send("Working");
});

router.post("/charges", async (req, res) => {
  const { email, amount } = req.body;
  console.log(req.body);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
    receipt_email: email,
  });
console.log(paymentIntent["client_secret"]);
  res.send({cc:paymentIntent["client_secret"]} );
});
router.post("/secret", async (req, res) => {
  // const {email, amount} = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1929,
    currency: "eur",
    payment_method_types: ["ideal"],
  });

  res.json({ client_secret: paymentIntent.client_secret });
});
// Database CRUD Operations
// @POST Request to GET the People
// GET
router.post("/paymentsuccessfull", (req, res) => {
  const {
    transactionId,
    email,
    fullName,
    phoneno,
    address,
    zipcode,
    userId,
    amount,
    note,
  } = req.body;
  res.setHeader("Content-Type", "application/json");
  Payment_Model.countDocuments({ transactionId })
    .then((count) => {
      if (count === 0) {
        const newSuccessfullPayment = new Payment_Model({
          transactionId,
          email,
          fullName,
          phoneno,
          address,
          zipcode,
          amount,
          note,
          userId,
          completed: false,
        });
        newSuccessfullPayment
          .save()
          .then(() => {
            Cart_Model.updateMany(
              { userId },
              { payment: true },
              { useFindAndModify: false }
            )
              .then(() => {
                const newStatus = new Status_Model({
                  userId,
                  payment: "Completed",
                  status: "Order Received",
                });
                newStatus
                  .save()
                  .then((data) => {
                    res.status(200).json("Users Update");
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => res.status(500).json(`Server Error is ${err}`));
      } else {
        res.status(200).json("Added");
      }
    })
    .catch((err) => res.status(500).json("Server Error"));
});
router.get("/getallproductapi", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductsmainstorefilters/:filter", (req, res) => {
  const { filter } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ gender: filter })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the Product Details
// GET
router.get("/getproductitemdetails/:id", (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ _id: id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductsapifilters/:filter", (req, res) => {
  const { filter } = req.params;
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({ Gender: filter })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});
router.use('/',CategoriesRouter);
router.use('/menu',MenuRouter);
router.use('/user',UserRouter)
router.use('/banners',BannersRouter);
router.use('/coupons',CouponsRouter);
router.use('/auth',AuthRouter);
router.use('/customer',CustomerRouter);
router.use('/order',OrderRouter);
router.use('/qr',QRCodeRouter);
module.exports = router;
