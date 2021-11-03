import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  Chip,
  MenuItem,
  DialogContent,
  TextField,
  InputLabel,
  Select,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";

const MenuList = (props) => {
  const {
    menuList,
    handleDeleteMenu,
    User,
    updateMenu,
    filteredMenuList,
    searchText,
  } = props;
  const [open, setOpen] = useState(false);
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [id, setId] = useState(null);
  const [MenuList, setMenuList] = useState([]);
  const [menu, setMenu] = useState({
    item: "",
    price: null,
    discount: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const handleClickOpen = (_id) => {
    console.log(_id);
    setId(_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    handleDeleteMenu(id);
    setId(null);
    setOpen(false);
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
  useEffect(() => {
    if (filteredMenuList.length > 0 || searchText !== "")
      setMenuList(filteredMenuList);
    else setMenuList(menuList);
  }, [menuList, filteredMenuList, searchText]);
  const handleChange = (e) => {
    setMenu({ ...menu, category: e.target.value });
  };
  const handleCloseEditMenu = () => {
    setOpenEditMenu(false);
  };
  return (
    <Card {...props}>
      <CardHeader title="Menu" />

      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Menu Item</TableCell>
                <TableCell>Price of Item</TableCell>
                <TableCell>Discount if any</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MenuList.map((menu) => (
                <>
                  <TableRow hover key={menu.id}>
                    <TableCell>{menu.item}</TableCell>
                    <TableCell>{menu.price}</TableCell>
                    <TableCell>{menu.discount}</TableCell>
                    <TableCell>{menu.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setMenu(menu);
                          setOpenEditMenu(true);
                        }}
                      >
                        Edit Menu
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="delete"
                        onClick={() => handleClickOpen(menu._id)}
                        onDelete={() => {}}
                        deleteIcon={<DeleteIcon style={{ color: "red" }} />}
                        style={{ color: "red" }}
                      />
                    </TableCell>
                  </TableRow>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Do you want to delete?"}
                    </DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose}>NO</Button>
                      <Button onClick={() => handleDelete()} autoFocus>
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

      <Divider />
      <Dialog
        open={openEditMenu}
        fullWidth
        onClose={() => handleCloseEditMenu(null)}
      >
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Menu Item"
            type="text"
            fullWidth
            value={menu.item}
            variant="standard"
            onChange={(e) => setMenu({ ...menu, item: e.target.value })}
          />
          <TextField
            margin="dense"
            id="name"
            label="Price of Item"
            type="text"
            value={menu.price}
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
            value={menu.discount}
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
              handleCloseEditMenu(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateMenu(menu);
              handleCloseEditMenu(null);
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

MenuList.propTypes = {
  menuList: PropTypes.array,
  User: PropTypes.object,
  handleDelete: PropTypes.func,
  updateMenu: PropTypes.func,
  filteredMenuList: PropTypes.any,
  searchText: PropTypes.string,
};
export default MenuList;
