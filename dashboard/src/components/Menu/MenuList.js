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
  Avatar,
  CardContent,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase from "../../Firebase/index";
import { Label } from "@material-ui/icons";

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
  const [imageUrl, setImageUrl] = useState(null);
  const [itemImage, setItemImage] = useState(null);
  const [showView, setShowView] = useState(false);
  const [loading,setloading]=useState(false);
  const [menu, setMenu] = useState({
    item: "",
    price: null,
    discount: "",
    category: "",
    description: "",
    image: "",
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
            let m=menu;
            m.image=ul;
            setMenu({ ...menu, image: ul })
            setImageUrl(ul);
            updateMenu(m);
            setloading(false);
            handleCloseEditMenu(null);
          });
      }
    );
  };
  const imageChangeHandler = (e) => {
    e.preventDefault();
    setItemImage(e.target.files[0]);

    setImageUrl(URL.createObjectURL(e.target.files[0]));
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
                      <Button
                        variant="contained"
                        onClick={() => {
                          setMenu(menu);
                         setShowView(true)
                        }}
                      >
                        View Menu
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
          <TextField
            margin="dense"
            id="name"
            label="Edit Description"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={menu.description}
            variant="standard"
            onChange={(e) => setMenu({ ...menu, description: e.target.value })}
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
                    src={imageUrl!==null?imageUrl:menu.image}
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
                  Change Item Image
                  <input type="file" hidden onChange={imageChangeHandler} />
                </Button>
              </Box>
            </Card>
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
              setloading(true);
             
              if(itemImage===null){
                updateMenu(menu);
                setloading(false);
                handleCloseEditMenu(null);
               
              }else{
                handleUpdateItemImage();
              }
            }}
          >
            Save Changes    {loading && <CircularProgress/>}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showView} fullWidth onClose={() => setShowView(false)}>
      <DialogTitle>Details</DialogTitle>

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
                  src={menu.image}
                  sx={{
                    height: 100,
                    width: 100,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
      <DialogContent sx={{display:"flex",justifyContent:"space-between"}}>
       <Box>     <InputLabel id="demo-simple-select-label">Menu Item</InputLabel>
        <Typography  gutterBottom >{menu.item}</Typography>
        <InputLabel id="demo-simple-select-label">Price</InputLabel>
        <Typography  gutterBottom  >{menu.price}</Typography></Box>
      <Box>  <InputLabel id="demo-simple-select-label">Discount</InputLabel>
        <Typography  gutterBottom  >{menu.discount}</Typography>
        <InputLabel id="demo-simple-select-label">
          Description
        </InputLabel>
        <Typography gutterBottom >{menu.description}</Typography>
        </Box>
       
        <Box sx={{ mt: 3 }}>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>

          <InputLabel id="demo-simple-select-label">{menu.category}</InputLabel>

      
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowView(null);
          }}
        >
          Close
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
