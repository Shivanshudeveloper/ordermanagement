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
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { makeStyles, styled } from "@material-ui/styles";
import { green } from "@mui/material/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import getUser from "../../Firebase/getUser";
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
  left:"2.5%"
 
}));
const Cart = ({
  cart,
  showCartHandler,
  handleDelete,
  increaseQuantity,
  decreaseQuantity,
  customer
}) => {
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [counter, setCounter] = useState(null);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [User, setUser] = useState({ displayName: "", email: "" });
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const findCoupon = () => {
    let index = coupons.findIndex((ele) => ele.couponCode === couponCode);
    console.log(coupons[index].discount[coupons[index].discount.length - 2]);
    if (index >= 0) {
      let amt = total;

      let disc =
        (amt *
          Number(coupons[index].discount[coupons[index].discount.length - 2])) /
        100;
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
    const getCoupons = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/coupons/getcoupons/${User.email}`
        );
        const content = await rawResponse.json();
        console.log(content);
        setCoupons(content);
      } catch (err) {}
    };

    getCoupons();
  }, [User]);
  useEffect(() => {
    let amt = 0;
    cart.forEach((item) => {
      amt += Number(item.selectedItem.price) * item.count;
    });
    setAmount(amt);
    setTotal(amt);
  }, [cart]);
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    get();
  }, []);
const checkout=()=>{
 
}
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
          sx={{ textAlign: "center", mt: 5 }}
        >
          CART
        </Typography>
        <Container
          sx={{
            height: "400px",
            overflow: "scroll",
            overflowX: "hidden",
            mt: 3,
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
                  {!couponApplied?<Box sx={{ mr: 4, p: 0, width: "0px" }}>
                    {" "}
                    <ArrowDropUpIcon
                      onClick={() => increaseQuantity(menu)}
                      sx={{ fontSize: "2.5em" }}
                    />
                    <ArrowDropDownIcon
                      onClick={() => decreaseQuantity(menu)}
                      sx={{ fontSize: "2.5em" }}
                    />
                  </Box>:null}
                  {!couponApplied?<Button onClick={() => handleDelete(menu)}>
                    {" "}
                    <DeleteIcon sx={{ color: "red", fontSize: "2.5em" }} />
                  </Button>:null}
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
        <Box   sx={{ justifyContent: "space-evenly", m: 1 }} >
        <label style={{color:"white"}}>Total:    </label>
          <label style={{color:"white",fontSize:"1.3em"}} >RM {total}</label>
        </Box>
          <label style={{color:"white",fontSize:"1em"}} onClick={checkout} >Continue Checkout</label>
        </ColorButton>
        <DialogActions>
          <Button onClick={() => showCartHandler(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
