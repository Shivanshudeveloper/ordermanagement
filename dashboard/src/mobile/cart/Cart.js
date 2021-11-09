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
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderRadius: "10px",
  },
}));

const Cart = ({ cart, showCartHandler,handleDelete}) => {
  const [open, setOpen] = useState(true);
  const [Cart,setCart]=useState(null);
  const classes = useStyles();
 const [counter,setCounter]=useState(null);
 const [total,setTotal]=useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
          let count={};
          let amount=0;
          cart.forEach((obj)=> {
                  amount+=Number(obj.price);
                var key = JSON.stringify(obj.item)
                count[key] = (count[key] || 0) + 1;
            });
            setCounter(count);
            setTotal(amount);
         let newa=[...new Set(cart)];
         setCart(newa);
  },[cart])
  const handleDeletehere=(menu)=>{
         
                  handleDelete(menu);
         
  }
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
          sx={{ textAlign: "center",mt:5 }}
        >
          CART
        </Typography>
        <DialogContent sx={{height:"500px",overflow:"scroll"}} >
          {Cart?.map((menu) => {
            return (
              <>
                <Grid key={menu._id} item sx={{ mb: 2 }} xs={12}>
                  <Paper
          sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}
                    onClick={() => handleClickOpen(menu)}
                    className={classes.paper}
                  >
                    <center>
                      <img alt="" src={menu.image} width="50px" height="50px" />
                    </center>
                    <h4>{menu.item}</h4>

                    <h5 style={{ color: "red" }}>RM {menu.price}</h5>
                    <h4>{counter[JSON.stringify(menu.item)]}</h4>
                    <Button onClick={()=>handleDeletehere(menu)}  >  Delete</Button>
                   
                  </Paper>{" "}
                </Grid>
              </>
            );
          })}
        </DialogContent>
        <Typography
          color="textPrimary"
          variant="h5"
          sx={{ textAlign: "left",ml:3}}
        >
         Total Amount: 
        </Typography>
        <Typography
          color="textPrimary"
          variant="h2"
          sx={{ textAlign: "right",mr:3}}
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
