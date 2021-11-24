import React from "react";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Header from "./components/Header";
import Carousel from "react-material-ui-carousel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import {
  Snackbar,
  Alert,
  Toolbar,
  ListItem,
  ListItemText,
  Divider,Link,SwipeableDrawer,Skeleton
} from "@material-ui/core";
import List from "./components/List";
import Categories from "./components/Categories";
import getUser from "../Firebase/getUser";
import { useEffect, useState } from "react";
import Cart from "./cart/Cart";
import CloseIcon from "@material-ui/icons/Close";
import { useNavigate } from "react-router-dom";
import { API_SERVICE } from "../URI";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./Payment/Payment";
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
const stripePromise = loadStripe(
  "pk_test_51JHsVhHTwp1a1ssgSKsY0MM2c51lL7qkbGLOghJe4SLwpbvZwSmJxjquqThrzP9LHQKkHdl2XGUoIT4o7u1rUi4I00U744HAUa"
);
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",

    alignItems: "center",
  },
  root2: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: "10px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Item = ({ item }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <img alt="" width="80%" height="210px" src={item.banner} />
    </Box>
  );
};

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [User, setUser] = useState(null);
  const [user, setuser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [menuList, setMenuList] = useState([]);
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [banners, setBanners] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSlectedCategory] = useState("viewAll");
  const [showCart, setShowCart] = useState(false);
  const [showBannerDetails, setShowBannerDetails] = useState(false);
  const [bannersDetails, setBannersDetails] = useState(null);
  const [showSnack, setShowSnack] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("");
  const [Query, setQuery] = useState("");
  const [orderDone,setOrderDone]=useState(false);
  const [paymentPending,setPaymentPending]=useState(false);
  const showCartHandler = (val) => {
    setShowCart(val);
  };
  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOpen(false);
  };
  const addToCart = () => {
    let cartTemp = cart;
    let index = cart.findIndex(
      (item) => item.selectedItem._id === selectedItem._id
    );
    if (index >= 0) {
      cartTemp[index].count += 1;
      setCart(cartTemp);
    } else {
      setCart((old) => [...old, { selectedItem: selectedItem, count: 1 }]);
    }
    console.log(cart);
    setSelectedItem(null);

    setShowSnackbar(true);
    handleClose();
  };
  useEffect(() => {
    let query = window.location.search.substring(1);
    setQuery(query);
    console.log(query);
    let vars = query?.split("&");
    let Email = vars[0]?.split("=")[1];
    let id = vars[1]?.split("=")[1];
    setUser({ email: Email, id: id });
  }, []);

  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setuser(content[0]);
        console.log(content);
      } catch (err) {
        console.log(err);
      }
    };
    const getmenu = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/menu/getmenu/${User.email}`
        );
        const content = await rawResponse.json();

        setMenuList(content);
        setError({ error: false, message: "" });
      } catch (err) {
        setError({ error: true, message: err.message });
      }
    };
    const getBanners = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/banners/getbanners/${User.email}`
        );
        const content = await rawResponse.json();
        console.log("Banners", content);
        setBanners(content);
      } catch (err) {}
    };
    get();
    getBanners();
    getmenu();
  }, [User]);

  const searchHandler = (e) => {
    let value = e.target.value;
    setSearchText(value);
    let filteredList = menuList.filter((menu) =>
      menu.item.toLowerCase().includes(value.toLowerCase())
    );
    console.log(filteredList);
    setFilteredMenuList(filteredList);
  };
  const changeCategoryHandler = (cat) => {
    setSlectedCategory(cat);
  };
  const decreaseQuantity = (menu) => {
    let cartTemp = [...cart];
    let index = cart.findIndex(
      (item) => item.selectedItem._id === menu.selectedItem._id
    );
    if (cartTemp[index].count > 1) {
      cartTemp[index].count -= 1;

      setCart(cartTemp);
    }
  };
  const increaseQuantity = (menu) => {
    let cartTemp = [...cart];
    let index = cart.findIndex(
      (item) => item.selectedItem._id === menu.selectedItem._id
    );
    if (cartTemp[index].count >= 1) {
      cartTemp[index].count += 1;

      setCart(cartTemp);
    }
  };
  const handleDelete = (menu) => {
    let cartTemp = [...cart];

    cartTemp = cartTemp.filter(
      (item) => item.selectedItem._id !== menu.selectedItem._id
    );
    setCart(cartTemp);
  };
  const setPaymentPendingHandler=(val)=>{
    setPaymentPending(val)
  }
  useEffect(() => {
    const getCustomer = async (c) => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/customer/getcustomer/${c.id}`,
          {
            method: "GET",
          }
        );
        const content = await rawResponse.json();
        setCustomer(content);
        const RAWRES=  await fetch(`${API_SERVICE}/api/v1/main/order/getpendingorder/${content.email}`);
        const Orders=await RAWRES.json();
         if(Orders.length!==0 && Orders[0].payment==="Pending"){
          setType(Orders[0].type);
          setTotal(Orders[0].totalamount);
          setPaymentPending(true);
         }
      } catch (err) {
        console.log(err);
      }
    };
    const verify = async () => {
      let query = window.location.search.substring(1);

      let vars = query.split("&");
      let guest = "false";
      if (vars.length === 5) {
        guest = vars[4].split("=")[1];
      }
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/auth/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const content = await rawResponse.json();
        console.log(content);
        if (content.id !== null) getCustomer(content);
        else {
          if (guest === "true") {
            return;
          }
          navigate(`/mobile/signin/?${Query}`);
        }
      } catch (err) {
        console.log(err);
      }
    };
    verify();
  }, [Query]);
  const setCustomerHandler = (val) => {
    setCustomer(val);
  };
  const setShowPaymentHandler = async(val, type, total) => {

    setType(type);
    setTotal(total);
    if(type==="Pickup")
    {
      let query = window.location.search.substring(1);

      let vars = query.split("&");
      let Email = vars[0].split("=")[1];
  
      let title = vars[2].split("=")[1];
      await fetch(`${API_SERVICE}/api/v1/main/order/addorder`, {
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
          adminEmail: Email,
          totalamount: total,
          status: "Order Preparing",
          type: type,
          payment:"Pending"
        }),
      });
      setType(null);
      setOrderDone(true);
      setPaymentPending(true);
    }
    else
       setShowPayment(val);
    if (val === false && type===null) {
      setShowCart(false);
      setCart([]);
    }else if(val===false && type!==null){
      
    }
  };
  if(orderDone){
    return(    <>
 
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          height: "100vh",
          alignItems: "center",
          justifyContent:"center"
        }}
      >
        <Typography sx={{ mt: 0 }} variant="h3" color="green">
          Thank you! 
        </Typography>
        
        <Typography sx={{textAlign:"center"}} variant="h3" color="green">
          Your order was successfully submitted!
        </Typography>
        <img
          src="https://res.cloudinary.com/dx9dnqzaj/image/upload/v1637056151/ordermanagement/f0ca90dd6924e009d86f4421cf2032b5_b3aokt.gif"
          alt=""
          width="100%"
          height="50%"
        />

        <Typography variant="h4">Order is Preparing</Typography>

        <Link
          sx={{ mt: 10 }}
          component="button"
          variant="h4"
          onClick={() => {
            setOrderDone(false);
            setShowCart(false);
            setCart([]);
        }}
        >
          Home
        </Link>
      </Box>
    </>)
  }
  if (showPayment) {
    return (
      <Elements stripe={stripePromise}>
        <Payment
          total={total}
          setPaymentPendingHandler={setPaymentPendingHandler}
          type={type}
          setShowPaymentHandler={setShowPaymentHandler}
          customer={customer}
          cart={cart}
        />
      </Elements>
    );
  }
  return (
    <>
      <Dialog
        fullScreen
        sx={{ mt: "50vh", height: "50vh" }}
        open={showBannerDetails}
        onClose={() => setShowBannerDetails(false)}
        TransitionComponent={Transition}
      >
        <Toolbar>
          <Typography
            sx={{ ml: 2, flex: 1, fontWeight: "800" }}
            variant="h5"
            component="div"
          >
            Offer Details
          </Typography>

          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setShowBannerDetails(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Typography
          variant="subtitle2"
          sx={{ ml: 4, mb: 1, fontWeight: "300" }}
        >
          Apply Coupons to get instant Discount
        </Typography>
        <Divider />

        <ListItem>
          <ListItemText
            primary="Coupon Name"
            secondary={
              <div>
                <Box
                  sx={{
                    backgroundColor: "#e3fbe3",
                    borderTop: "5px dashed lightgreen",
                    borderBottom: "5px dashed lightgreen",
                    fontWeight: "800",
                    p: 0.5,
                    fontSize: "1.2em",
                    textAlign: "center",
                  }}
                >
                  {bannersDetails?.coupon.couponCode}
                </Box>
                <Box sx={{ fontSize: "1.3em", fontWeight: "800" }}>
                  Get {bannersDetails?.coupon.discount} OFF
                </Box>
              </div>
            }
          />
          <Typography
            onClick={() => {
              navigator.clipboard.writeText(bannersDetails?.coupon.couponCode);
              setShowSnack(true);
            }}
            variant="h5"
            sx={{
              ml: 4,
              mb: 1,
              fontWeight: "800",
              color: "orange",
              textDecoration: "underline",
            }}
          >
            TAP TO COPY CODE
          </Typography>
        </ListItem>

        <ListItem>
          <ListItemText
            primary={"Terms & Conditions"}
            secondary={bannersDetails?.TandC}
          />
        </ListItem>
      </Dialog>
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
      >
        <Alert
          onClose={() => setShowSnack(false)}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Copied
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{selectedItem?.item}</DialogTitle>
        <DialogContent>
          <section>
            <center>
              <img
                alt=""
                style={{ width: "100%", borderRadius: "10px" }}
                src={selectedItem?.image}
              />
            </center>

            <h4 style={{ marginTop: "10px", color: "green" }}>
              {selectedItem?.price}
            </h4>

            <p style={{ marginTop: "10px" }}>{selectedItem?.description}</p>
          </section>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={addToCart} color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {showCart ? (
        <Cart
          setShowPaymentHandler={setShowPaymentHandler}
          handleDelete={handleDelete}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          showCartHandler={showCartHandler}
          cart={cart}
          customer={customer}
        />
      ) : null}
    
         <SwipeableDrawer

        anchor="bottom"
        open={paymentPending}
   
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
           
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
      
        </StyledBox>
        <StyledBox
          sx={{
            p:0.5,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox>
        <Button variant="contained" onClick={()=>setShowPayment(true)}>Payment Pending</Button>
      </SwipeableDrawer>
      <Header
        cart={cart}
        user={user}
        showCartHandler={showCartHandler}
        customer={customer}
        setCustomerHandler={setCustomerHandler}
      />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Added to Cart
        </Alert>
      </Snackbar>
      <Container>
        <Carousel>
          {banners.map((item) => (
            <Box
              onClick={() => {
                if (item.TandC !== "") {
                  setBannersDetails(item);
                  setShowBannerDetails(true);
                }
              }}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <img alt="" width="80%" height="210px" src={item.banner} />
            </Box>
          ))}
        </Carousel>
      </Container>
      <Container>
        <Paper component="form" className={classes.root2}>
          <InputBase
            className={classes.input}
            placeholder="Search Menu Items"
            inputProps={{ "aria-label": "search google maps" }}
            value={searchText}
            onChange={(e) => searchHandler(e)}
          />
          <IconButton
            type="button"
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Categories User={User} changeCategoryHandler={changeCategoryHandler} />
        <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>
          Restaurent Items
        </h4>
        <Grid container spacing={3}>
          {filteredMenuList.length > 0 ? (
            filteredMenuList.map((menu) => {
              return (
                <Grid
                  key={menu._id}
                  item
                  xs={user === null ? 6 : user.layout ? 6 : 12}
                >
                  {menu?.category === selectedCategory ? (
                    <Paper
                      onClick={() => handleClickOpen(menu)}
                      className={classes.paper}
                    >
                      <center>
                        <img
                          alt=""
                          src={menu.image}
                          width="100px"
                          height="100px"
                        />
                      </center>
                      <h4 style={{ marginTop: "10px" }}>{menu.item}</h4>

                      <h5 style={{ color: "red" }}>RM {menu.price}</h5>
                    </Paper>
                  ) : selectedCategory === "viewAll" ? (
                    <Paper
                      onClick={() => handleClickOpen(menu)}
                      className={classes.paper}
                    >
                      <center>
                        <img
                          alt=""
                          src={menu.image}
                          width="100px"
                          height="100px"
                        />
                      </center>
                      <h4 style={{ marginTop: "10px" }}>{menu.item}</h4>

                      <h5 style={{ color: "red" }}>RM {menu.price}</h5>
                    </Paper>
                  ) : null}
                </Grid>
              );
            })
          ) : searchText !== "" ? (
            <Box sx={{ marginLeft: "45%", marginTop: "10%" }}>
              <Typography>Not Found</Typography>
            </Box>
          ) : (
            menuList.map((menu) => {
              return (
                <Grid
                  key={menu._id}
                  item
                  xs={user === null ? 6 : user.layout ? 6 : 12}
                >
                  {menu?.category === selectedCategory ? (
                    <Paper
                      onClick={() => handleClickOpen(menu)}
                      className={classes.paper}
                    >
                      <center>
                        <img
                          alt=""
                          src={menu.image}
                          width="100px"
                          height="100px"
                        />
                      </center>
                      <h4 style={{ marginTop: "10px" }}>{menu.item}</h4>

                      <h5 style={{ color: "red" }}>RM {menu.price}</h5>
                    </Paper>
                  ) : selectedCategory === "viewAll" ? (
                    <Paper
                      onClick={() => handleClickOpen(menu)}
                      className={classes.paper}
                    >
                      <center>
                        <img
                          alt=""
                          src={menu.image}
                          width="100px"
                          height="100px"
                        />
                      </center>
                      <h4 style={{ marginTop: "10px" }}>{menu.item}</h4>

                      <h5 style={{ color: "red" }}>RM {menu.price}</h5>
                    </Paper>
                  ) : null}
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
