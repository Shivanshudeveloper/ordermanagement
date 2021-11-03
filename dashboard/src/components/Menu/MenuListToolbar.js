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
  InputBase
} from "@material-ui/core";

import PropTypes from "prop-types";

import SearchIcon from "@material-ui/icons/Search";


import { useState, useEffect } from "react";
const MenuListToolbar = (props) => {
  const {
    handleClickOpen,
    handleClose,
    setMenuListHandler,
    open,
    User,
    restaurantName,searchHandler
  } = props;
  const [menu, setMenu] = useState({
    item: "",
    price: null,
    discount: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setMenu({ ...menu, category: e.target.value });
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
const searchValueHandle=(e)=>{
  searchHandler(e.target.value);
}
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
            onChange={(e)=>searchValueHandle(e)}
            
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
            onClick={handleClickOpen}
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
                });
                handleClose(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setMenuListHandler({
                  ...menu,
                  email: User.email,
                  restaurantName: restaurantName,
                  userID: User.uid,
                });
                handleClose({
                  ...menu,
                  email: User.email,
                  restaurantName: restaurantName,
                  userID: User.uid,
                });
              }}
            >
              Add
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
  searchHandler:PropTypes.func
};
export default MenuListToolbar;
