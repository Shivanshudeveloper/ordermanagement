import {
  Box,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  Divider,
  TextField,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles, styled } from "@material-ui/styles";
import { green } from "@mui/material/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import getUser from "../../Firebase/getUser";
import { API_SERVICE } from "../../URI";
import { validate } from "uuid";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: "10px",
  },
}));
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[600]),
  backgroundColor: green[600],
  "&:hover": {
    backgroundColor: green[800],
  },
  width: "95%",
  left: "2.5%",
}));
const Cart = ({
  cart,
  showCartHandler,
  handleDelete,
  increaseQuantity,
  decreaseQuantity,
  customer,
}) => {
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [counter, setCounter] = useState(null);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [adminEmail, setAdminEmail] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const [type, setType] = useState("Dine In");
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const findCoupon = () => {
    let index = coupons.findIndex((ele) => ele.couponCode === couponCode);

    if (index >= 0) {
      let amt = total;

      let disc = 0;
      if (coupons[index].discount[coupons[index].discount.length - 1] === "%")
        disc =
          (amt *
            Number(
              coupons[index].discount.slice(
                0,
                coupons[index].discount.length - 2
              )
            )) /
          100;
      else
        disc = Number(
          coupons[index].discount.slice(0, coupons[index].discount.length - 2)
        );
      amt = amt - disc;
      setDiscount(disc);
      setTotal(amt);
      setCouponApplied(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let Email = vars[0].split("=")[1];
    let Type = vars[3].split("=")[1];
    if (Type === "SocialMediaCampaigns") setType("Pickup");

    setAdminEmail(Email);
    const getCoupons = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/coupons/getcoupons/${Email}`
        );
        const content = await rawResponse.json();
        console.log(content);
        setCoupons(content);
      } catch (err) {}
    };

    getCoupons();
  }, []);
  useEffect(() => {
    let amt = 0;
    cart.forEach((item) => {
      amt += Number(item.selectedItem.price) * item.count;
    });
    setAmount(amt);
    setTotal(amt);
  }, [cart]);

  const checkout = () => {
    let query = window.location.search.substring(1);

    let vars = query.split("&");
    let Email = vars[0].split("=")[1];
    let id = vars[1].split("=")[1];

    let title = vars[2].split("=")[1];
    fetch(`${API_SERVICE}/api/v1/main/order/addorder`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        orders: cart,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        adminEmail: adminEmail,
        totalamount: total,
        status: "Order Preparing",
        type:type
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        navigate(
          `/mobile/payment/?email=${Email}&id=${id}&title=${title}&type=${type}&amount=${total}&customeremail=${customer.email}`,
          { replace: true }
        );
      })
      .catch((err) => {
        console.log(err);
      });
    if (total === 0) return;
  };

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        fullScreen
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Typography
          color="textPrimary"
          variant="h4"
          sx={{ textAlign: "center", mt: 1 }}
        >
          CART
        </Typography>
        <Container
          sx={{
            height: "400px",
            overflow: "scroll",
            overflowX: "hidden",
            mt: 0,
          }}
        >
          {cart?.map((menu) => {
            return (
              <Grid
                key={menu.selectedItem._id}
                item
                sx={{ mb: 2, maxHeight: "100px" }}
                xs={12}
              >
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => handleClickOpen(menu)}
                  className={classes.paper}
                >
                  <center>
                    <img
                      alt=""
                      src={menu.selectedItem.image}
                      width="30px"
                      height="30px"
                    />
                  </center>
                  <h4>{menu.selectedItem.item}</h4>

                  <h5 style={{ color: "red" }}>RM {menu.selectedItem.price}</h5>
                  <h4>{menu.count}</h4>
                  {!couponApplied ? (
                    <Box sx={{ mr: 4, p: 0, width: "0px" }}>
                      {" "}
                      <ArrowDropUpIcon
                        onClick={() => increaseQuantity(menu)}
                        sx={{ fontSize: "2.5em" }}
                      />
                      <ArrowDropDownIcon
                        onClick={() => decreaseQuantity(menu)}
                        sx={{ fontSize: "2.5em" }}
                      />
                    </Box>
                  ) : null}
                  {!couponApplied ? (
                    <Button onClick={() => handleDelete(menu)}>
                      {" "}
                      <DeleteIcon sx={{ color: "red", fontSize: "2.5em" }} />
                    </Button>
                  ) : null}
                </Paper>{" "}
              </Grid>
            );
          })}
        </Container>
     
        {!showCouponInput ? (
          <Button onClick={() => setShowCouponInput(true)} variant="outlined">
            APPLY COUPON
          </Button>
        ) : !couponApplied ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Coupon Code"
              variant="outlined"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
              }}
            />
            <Button onClick={findCoupon} variant="outlined">
              Check
            </Button>
          </Box>
        ) : (
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            disabled
            value={"Coupon Applied"}
          />
        )}
           {type === "Pickup" || type === "Delivery" ? (
          
          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            
            <RadioGroup
              aria-label="Type"
              name="controlled-radio-buttons-group"
              value={type}
              onChange={(e) => {setType(e.target.value)}}
            >
          <Box sx={{display:"flex",justifyContent:"center"}}>
           <FormControlLabel
                value="Pickup"
                control={<Radio />}
                label="Pickup"
              />
              <FormControlLabel
                value="Delivery"
                control={<Radio />}
                label="Delivery"
              />
             </Box>
            </RadioGroup>
        
          </FormControl>
           
        ) : null}
        <Container>
          <Typography
            color="textPrimary"
            variant="h3"
            sx={{ textAlign: "left", mt: 5, fontWeight: "800" }}
          >
            Bill Details
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
            <label>Item Total </label>

            <h3>RM {amount}</h3>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
            <label>Discount </label>

            <h3>RM {discount}</h3>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
            <h2>Total </h2>

            <h3>RM {total}</h3>
          </Box>
        </Container>

        <ColorButton
          sx={{ display: "flex", justifyContent: "space-between", m: 0 }}
          variant="contained"
        >
          {" "}
          <Box onClick={checkout} sx={{ justifyContent: "space-evenly", m: 1 }}>
            <label style={{ color: "white" }}>Total: </label>
            <label style={{ color: "white", fontSize: "1.3em" }}>
              RM {total}
            </label>
          </Box>
          <label style={{ color: "white", fontSize: "1em" }} onClick={checkout}>
            Continue Checkout
          </label>
        </ColorButton>
        <DialogActions>
          <Button onClick={() => showCartHandler(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
