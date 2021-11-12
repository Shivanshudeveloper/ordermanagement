import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  InputLabel,
  Select,
  Paper,
  IconButton,
  Divider,
  InputBase,
  CardContent,
  Card,
  Avatar,
  CircularProgress,
} from "@material-ui/core";

import PropTypes from "prop-types";

import SearchIcon from "@material-ui/icons/Search";
import firebase from "../../Firebase/index";

import { useState, useEffect } from "react";
const MenuListToolbar = (props) => {
  const {
    handleClickOpen,
    handleClose,
    setMenuListHandler,
    open,
    User,
    restaurantName,
    searchHandler,
  } = props;
  const [menu, setMenu] = useState({
    item: "",
    price: null,
    discount: "",
    category: "",
    description: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [itemImage, setItemImage] = useState(null);
  const [loading, setloading] = useState(false);
  const handleChange = (e) => {
    setMenu({ ...menu, category: e.target.value });
  };
  const handleUpdateItemImage = () => {
    const storage = firebase.storage();
    console.log(storage);
    const uploadTask = storage
      .ref(`itemImage/${itemImage.name}`)
      .put(itemImage);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("itemImage")
          .child(itemImage.name)
          .getDownloadURL()
          .then((ul) => {
            setImageUrl(ul);
            setMenuListHandler({
              ...menu,
              email: User.email,
              restaurantName: restaurantName,
              userID: User.uid,
              image: ul,
            });
            handleClose({
              ...menu,
              email: User.email,
              restaurantName: restaurantName,
              userID: User.uid,
              image: ul,
            });
            setloading(false);
          });
      }
    );
  };
  useEffect(() => {
    const getCategories = async () => {
      if (categories.length !== 0) return;
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/getcategories/${User.email}`
        );
        const content = await rawResponse.json();

        setCategories(content);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  }, [User]);
  const searchValueHandle = (e) => {
    searchHandler(e.target.value);
  };
  const imageChangeHandler = (e) => {
    e.preventDefault();
    setItemImage(e.target.files[0]);

    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      {" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 600,
            mb: 5,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Items"
            inputProps={{ "aria-label": "search items" }}
            onChange={(e) => searchValueHandle(e)}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>{" "}
        <Box>
          <Button
            color="primary"
            variant="contained"
            sx={{ mb: 5 }}
            onClick={() => {
              setImageUrl(null);
              handleClickOpen();
            }}
          >
            Add Menu
          </Button>
        </Box>
        <Dialog open={open} fullWidth onClose={() => handleClose(null)}>
          <DialogTitle>Enter Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Menu Item"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setMenu({ ...menu, item: e.target.value })}
            />
            <TextField
              margin="dense"
              id="name"
              label="Price of Item"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setMenu({ ...menu, price: e.target.value })}
            />
            <TextField
              margin="dense"
              id="name"
              label="Discount if any"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setMenu({ ...menu, discount: e.target.value })}
            />
            <TextField
              margin="dense"
              id="name"
              label="Add Description"
              type="text"
              fullWidth
              multiline
              minRows={3}
              variant="standard"
              onChange={(e) =>
                setMenu({ ...menu, description: e.target.value })
              }
            />
            <Box sx={{ mt: 3 }}>
              <InputLabel id="demo-simple-select-label">
                Select Category
              </InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                fullWidth
                label="Category"
                value={menu.category}
                onChange={handleChange}
              >
                {categories?.map((cat) => {
                  return (
                    <MenuItem value={cat.category} key={cat.category}>
                      {cat.category}
                    </MenuItem>
                  );
                })}
              </Select>

              <Card sx={{ marginTop: "20px" }}>
                <CardContent sx={{ height: "200px" }}>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={imageUrl ? imageUrl : itemImage}
                      sx={{
                        height: 100,
                        width: 100,
                      }}
                    />
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    mb: 4,
                  }}
                >
                  <Button variant="contained" component="label">
                    Choose Item Image
                    <input type="file" hidden onChange={imageChangeHandler} />
                  </Button>
                </Box>
              </Card>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setMenu({
                  item: "",
                  price: null,
                  discount: "",
                  category: "",
                  description: "",
                  image: "",
                });
                handleClose(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setloading(true);
                handleUpdateItemImage();
                if (itemImage === null) {
                  setMenuListHandler({
                    ...menu,
                    email: User.email,
                    restaurantName: restaurantName,
                    userID: User.uid,
                    image: imageUrl,
                  });
                  handleClose({
                    ...menu,
                    email: User.email,
                    restaurantName: restaurantName,
                    userID: User.uid,
                    image: imageUrl,
                  });
                }
              }}
            >
              Add {loading && <CircularProgress />}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
MenuListToolbar.propTypes = {
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  setCategoryHandler: PropTypes.func,
  open: PropTypes.bool,
  categories: PropTypes.array,
  User: PropTypes.object,
  restaurantName: PropTypes.any,
  searchHandler: PropTypes.func,
};
export default MenuListToolbar;
