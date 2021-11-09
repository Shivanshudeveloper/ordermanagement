import React from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { withStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
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
  countlabel: {
    color: "green",
    fontSize: "1em",
  },
}));
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);
export default function ButtonAppBar({ cart, user,showCartHandler }) {
  const classes = useStyles();
  const navigate = useNavigate();

 
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
          {user?.logo === "" ? (
            <Typography
              variant="h4"
              className={classes.title}
              sx={{ color: "black" }}
            >
              {user?.restaurantName}
            </Typography>
          ) : (
            <Box className={classes.title}>
              <img src={user?.logo} width="50px" height="50px" alt={""} />
            </Box>
          )}

          <IconButton
            onClick={() => showCartHandler(true)}
            aria-label="cart"
          >
            <StyledBadge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon sx={{ width: "40px", height: "40px" }} />
            </StyledBadge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
