import { Helmet } from "react-helmet";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CardContent,
  Card,
  Chip,
  ImageList,
  DialogActions,
  ImageListItem,
  ImageListItemBar,
  Slide,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useState, useEffect, forwardRef } from "react";
import firebase from "../Firebase/index";
import getUser from "../Firebase/getUser";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import { TextareaAutosize } from "@mui/core";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Banners = () => {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [User, setUser] = useState({ displayName: "", email: "" });
  const [banners, setBanners] = useState([]);
  const [deleteBanner, setDeleteBanner] = useState(null);
  const [showBannerDetails, setShowBannerDetails] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [openDeleteBannerPrompt, setOpenDeleteBannerPrompt] = useState(false);
  const [TandC, setTandC] = useState("");
  const [bannersDetails,setBannersDetails]=useState(null);
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    get();
  }, []);
  useEffect(() => {
    const getCoupons = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/coupons/getcoupons/${User.email}`
        );
        const content = await rawResponse.json();
       
        setCoupons(content);
      } catch (err) {}
    };

    getCoupons();
  }, [User]);
  const uploadBanner = async (ul) => {
    try {
      const rawResponse = await fetch(
        "http://localhost:5000/api/v1/main/banners/addbanner",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner: ul,
            email: User.email,
            name: image.name,
            TandC,
            coupon: selectedCoupon,
          }),
        }
      );
      const content = await rawResponse.json();
      console.log(content);
      setBanners((old) => [...old, content]);
      setImageUrl("");
      setImage("");
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setImageUrl("");
      setImage("");
      setOpen(false);
    }
  };
  const handleUpdateItemImage = () => {



 
    const storage = firebase.storage();
    setLoading(true);
    const uploadTask = storage.ref(`banners/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("banners")
          .child(image.name)
          .getDownloadURL()
          .then((ul) => {
            setImageUrl(ul);
            uploadBanner(ul);
          });
      }
    );
  };
  useEffect(() => {
    const getBanners = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/banners/getbanners/${User.email}`
        );
        const content = await rawResponse.json();
         console.log(content);
        setBanners(content);
      } catch (err) {}
    };

    getBanners();
  }, [User]);
  const handleDeleteBanner = async () => {
    if (deleteBanner === null) {
      setOpenDeleteBannerPrompt(false);
      return;
    }
    try {
      const rawResponse = await fetch(
        `http://localhost:5000/api/v1/main/banners/removebanner/${deleteBanner._id}`,
        {
          method: "delete",
        }
      );
      const res = await rawResponse.json();
      console.log(res);
      const newBan = banners.filter(
        (bannner) => bannner._id !== deleteBanner._id
      );
      setBanners(newBan);
      setOpenDeleteBannerPrompt(false);
      setDeleteBanner(null);
    } catch (err) {
      setOpenDeleteBannerPrompt(false);
      console.log(err);
      setDeleteBanner(null);
    }
  };
  const imageChangeHandler = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);

    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  const addBanner = () => {
    if (image !== "") handleUpdateItemImage();
  };
  const closeBanner = () => {
    setImageUrl("");
    setImage("");
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Banners</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          m: 10,

          mb: 0,
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
          Banners
        </Typography>

        <Button
          variant="contained"
          component="label"
          onClick={() => setOpen(true)}
        >
          Add Banner
        </Button>
      </Box>
      <Box sx={{ ml: 5, mr: 5 }}>
        <ImageList>
          {banners.map((item) => (
            <ImageListItem
              key={item._id}
              sx={{ m: 5, boxShadow: "1px 1px  10px 1px lightgrey" }}
             
            >
              <img
                src={`${item.banner}`}
                srcSet={`${item.banner}`}
                alt={item.name}
                loading="lazy"
                onClick={() => {
                  setBannersDetails(item);
                  setShowBannerDetails(true);
                }}
              />
              <ImageListItemBar title={item.name} position="below" />

              <Box
                sx={{
                  display: "flex",
                  ml: 25,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Button
                  varient="contained"
                  onClick={() => {
                    setDeleteBanner(item);
                    setOpenDeleteBannerPrompt(true);
                  }}
                  style={{ color: "red", width: "50%" }}
                >
                  delete <DeleteIcon style={{ color: "red" }} />
                </Button>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Dialog
        fullScreen
        open={showBannerDetails}
        onClose={() => setShowBannerDetails(false)}
        TransitionComponent={Transition}
      >
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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

        <List>
          <ListItem button>
            <ListItemText primary="Coupon Name" secondary={bannersDetails?.couponCode} />
          </ListItem>
          <Divider />

          <ListItem button>
            <ListItemText
              primary={"Terms & Conditions"}
              secondary={bannersDetails?.TandC}
           
                  // 1. Minum order of RM 20
            
                  // 2. Applicable on Dine-In.Delivery.Pick Up. Orders
                
                  // 3. Applicable on QR scanned orders only
            
              
            />
          </ListItem>
        </List>
      </Dialog>
      <Dialog open={open} fullWidth onClose={() => {}}>
        <DialogTitle>Banner</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            <Card sx={{ marginTop: "20px" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img alt="" variant="rounded" src={imageUrl} width="500px" />
                </Box>
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  m: 1,
                }}
              >
                <Button variant="contained" component="label" sx={{ mb: 3 }}>
                  Choose Banner
                  <input
                    type="file"
                    hidden
                    onChange={(e) => imageChangeHandler(e)}
                  />
                </Button>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Select Coupon Name
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  fullWidth
                  label="Category"
                  value={selectedCoupon.couponCode}
                  sx={{ mb: 3 }}
                  onChange={(e) => {
                    setSelectedCoupon(coupons.find((ele)=>ele.couponCode===e.target.value));
                  }}
                >
                  {coupons?.map((cat) => {
                    return (
                      <MenuItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        value={cat.couponCode}
                        key={cat}
                      >
                        <label> {cat.couponCode}</label>
                        <label> {cat.discount}</label>
                      </MenuItem>
                    );
                  })}
                </Select>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Write Terms and Condition
                </Typography>
                <textarea
                  value={TandC}
                  style={{minHeight:"100px",fontSize:"1.3em"}}
                  onChange={(e) => setTandC(e.target.value)}
                />
              </Box>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              closeBanner();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addBanner();
            }}
          >
            Add {loading && <CircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteBannerPrompt}
        onClose={() => {
          setOpenDeleteBannerPrompt(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteBannerPrompt(false);
            }}
          >
            NO
          </Button>
          <Button onClick={() => handleDeleteBanner()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Banners;
