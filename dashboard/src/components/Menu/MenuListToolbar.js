
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
const MenuListToolbar = (props) => {
  const { handleClickOpen, handleClose, setMenuListHandler, open } = props;
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
          "http://localhost:5000/api/v1/main/getcategories"
        );
        const content = await rawResponse.json();

        setCategories(content);
      } catch (err) {
        console.log(err);
      }
    };
    getCategories();
  }, []);

  return (
    <>
      {" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {" "}
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Menu
        </Button>
        <Dialog open={open} fullWidth onClose={()=>handleClose(null)}>
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
              autoFocus
              margin="dense"
              id="name"
              label="Price of Item"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setMenu({ ...menu, price: e.target.value })}
            />
            <TextField
              autoFocus
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={()=>{setMenuListHandler(menu); handleClose(menu);}}>Add</Button>
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
};
export default MenuListToolbar;
