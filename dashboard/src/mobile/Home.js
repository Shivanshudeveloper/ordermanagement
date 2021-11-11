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
import { Snackbar, Alert } from "@material-ui/core";
import List from "./components/List";
import Categories from "./components/Categories";
import getUser from "../Firebase/getUser";
import { useEffect, useState } from "react";
import Cart from "./cart/Cart";
import {  useNavigate } from 'react-router-dom';
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
  const [customer,setCustomer]=useState(null);
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
    if(customer===null){
      navigate('/mobile/signin',{replace:true});
    }
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

    setSelectedItem(null);

    setShowSnackbar(true);
    handleClose();
  };
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    if (User === null) get();
  }, []);
  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/user/getuser/${User.email}`
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
          `http://localhost:5000/api/v1/main/menu/getmenu/${User.email}`
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
          `http://localhost:5000/api/v1/main/banners/getbanners/${User.email}`
        );
        const content = await rawResponse.json();

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
useEffect(()=>{
  const getCustomer=async(id)=>{
    try {
      const rawResponse = await fetch(
        `http://localhost:5000/api/v1/main/customer/getcustomer?id=${id}`,{
          method: "GET"
        }
      );
      const content = await rawResponse.json();
      console.log(content);
      setCustomer(content);
    } catch (err) {
      console.log(err);
    }
  }
  const verify = async () => {
    try {
      const rawResponse = await fetch(
        `http://localhost:5000/api/v1/main/auth/verify`,{
          method: "GET",
          credentials: "include",
        }
      );
      const content = await rawResponse.json();
      if(content.id!==null)
      getCustomer(content.id)
    } catch (err) {
      console.log(err);
    }
  };

  verify();
},[])
const setCustomerHandler=(val)=>{
  setCustomer(val);
}
  return (
    <>
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
          handleDelete={handleDelete}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          showCartHandler={showCartHandler}
          cart={cart}
          customer={customer} 
        />
      ) : null}
      <Header cart={cart} user={user} showCartHandler={showCartHandler} customer={customer} setCustomerHandler={setCustomerHandler} />
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
          {banners.map((banner, i) => (
            <Item key={i} item={banner} />
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
                  <Paper
                    sx={{ m: 0 }}
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
                  ) :   selectedCategory === "viewAll"?    (<Paper
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
                </Paper>):null }
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
