import React from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import {
  Box
} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    // marginLeft: '95px',

    margin: "auto",
    width: "50%",
    padding: "10px",
  },
  countlabel:{
    color:"green",
    fontSize:"1em"
  }
}));

export default function ButtonAppBar({cart,user}) {
  const classes = useStyles();
 console.log(user);
  return (
    <div className={classes.root}>
      <AppBar
        style={{ backgroundColor: "#fff", color: "#000" }}
        position="static"
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          {user?.logo===""? <Typography variant="h4" className={classes.title} sx={{color:"black"}}>
            {user?.restaurantName}
          </Typography>:<Box  className={classes.title} ><img   src={user?.logo} width="50px" height="50px" alt={""} /></Box>}
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ShoppingBasketIcon />
            <Typography  className={classes.countlabel} >{cart.length}</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
