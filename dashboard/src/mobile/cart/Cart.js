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
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: "10px",
  },
}));

const Cart = ({
  cart,
  showCartHandler,
  handleDelete,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [counter, setCounter] = useState(null);
  const [total, setTotal] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    let amount = 0;
    cart.forEach((item) => {
      amount += Number(item.selectedItem.price) * item.count;
    });
    setTotal(amount);
   
  }, [cart]);

  console.log(counter);
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
        <DialogContent sx={{ height: "500px", overflow: "scroll" }}>
          {cart?.map((menu) => {
            return (
              <Grid key={menu.selectedItem._id} item sx={{ mb: 2 }} xs={12}>
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
                      width="50px"
                      height="50px"
                    />
                  </center>
                  <h4>{menu.selectedItem.item}</h4>

                  <h5 style={{ color: "red" }}>RM {menu.selectedItem.price}</h5>
                  <h4>{menu.count}</h4>
                  <Box sx={{ mr: 4, p: 0, width: "0px" }}>
                    {" "}
                    <ArrowDropUpIcon
                      onClick={() => increaseQuantity(menu)}
                      sx={{ fontSize: "3.5em" }}
                    />
                    <ArrowDropDownIcon
                      onClick={() => decreaseQuantity(menu)}
                      sx={{ fontSize: "3.5em" }}
                    />
                  </Box>
                  <Button onClick={() => handleDelete(menu)}>
                    {" "}
                    <DeleteIcon sx={{ color: "red", fontSize: "2.5em" }} />
                  </Button>
                </Paper>{" "}
              </Grid>
            );
          })}
        </DialogContent>
        <Typography
          color="textPrimary"
          variant="h5"
          sx={{ textAlign: "left", ml: 3 }}
        >
          Total Amount:
        </Typography>
        <Typography
          color="textPrimary"
          variant="h2"
          sx={{ textAlign: "right", mr: 3 }}
        >
          {total}
        </Typography>

        <DialogActions>
          <Button onClick={() => showCartHandler(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
