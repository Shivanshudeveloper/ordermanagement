import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  ImageListItem,
  Typography,
  MenuItem,
  Avatar,
  CircularProgress,
  Container,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useState } from "react";
import firebase from "../../Firebase/index";
import SaveIcon from "@material-ui/icons/Save";

const icons = [
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/1.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/2.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/3.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/4.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/5.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/6.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/7.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/8.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/9.png`,
  `${process.env.PUBLIC_URL}/static/images/categoryIcons/10.png`,
];

const CustomerListToolbar = (props) => {
  const { handleClickOpen, handleClose, setCategoryHandler, open } = props;
  const [category, setCategory] = useState({ category: "", icon: "" });
  const [selectedIcon, setSelectedIcon] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(selectedIcon);
  const handleUpdateItemImage = (file) => {
    const storage = firebase.storage();
    let File = file === null ? itemImage : file;
    const uploadTask = storage.ref(`categoryIcon/${File.name}`).put(File);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("categoryIcon")
          .child(File.name)
          .getDownloadURL()
          .then((ul) => {
            setCategory((prev) => ({ ...prev, icon: ul }));
            handleClose({ category: category.category, icon: ul });
            setSelectedIcon("");
            setItemImage(null);
            setImage(null);
            setLoading(false);
          });
      }
    );
  };
  const createFile = async () => {
    let response = await fetch(selectedIcon);

    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File(
      [data],
      `${selectedIcon[selectedIcon.length - 5]}.jpg`,
      metadata
    );
    setItemImage(file);
    handleUpdateItemImage(file);
  };

  const imageChangeHandler = (e) => {
    e.preventDefault();
    setItemImage(e.target.files[0]);

    setSelectedIcon(URL.createObjectURL(e.target.files[0]));
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleUp = () => {
    setLoading(true);
    if (itemImage === null) {
      createFile();
      return;
    }
    handleUpdateItemImage(null);
  };
  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          Add Category
        </Button>
        <Dialog open={open} fullWidth onClose={handleClose}>
          <DialogTitle>Enter Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Category"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, category: e.target.value }))
              }
            />
            <Typography color="textPrimary" variant="h4" sx={{ m: 3 }}>
              Select Icon
            </Typography>
            <Container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "400px",
                height: "200px",
                overflowY: "scroll",
                flexWrap: "wrap",
              }}
            >
              {selectedIcon === "" ? (
                icons?.map((icon, id) => {
                  return (
                    <Box
                      onClick={(e) => setSelectedIcon(icon)}
                      sx={{ cursor: "pointer" }}
                      value={icon}
                      key={id}
                    >
                      <img
                        alt=""
                        key={id}
                        value={icon}
                        src={icon}
                        width="100px"
                        height="100px"
                      />
                    </Box>
                  );
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <img alt="" src={selectedIcon} width="100px" height="100px" />

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedIcon("");
                    }}
                  >
                    Reselect
                  </Button>
                </Box>
              )}
            </Container>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography color="textPrimary" variant="h4" sx={{ m: 3 }}>
                  or
                </Typography>

                <Button sx={{ m: 5 }} variant="contained" component="label">
                  Upload Icon
                  <input type="file" hidden onChange={imageChangeHandler} />
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSelectedIcon("");
                setItemImage(null);
                setImage(null);
                handleClose(null);
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<SaveIcon />}
              variant="outlined"
              onClick={() => {
                handleUp();
              }}
            >
              Add {loading && <CircularProgress />}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
CustomerListToolbar.propTypes = {
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  setCategoryHandler: PropTypes.func,
  open: PropTypes.bool,
};
export default CustomerListToolbar;
