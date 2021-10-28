import React from 'react';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
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
    color: '#097969',
    margin: 'auto',
    width: '50%',
    padding: '10px'
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar style={{ backgroundColor: '#fff', color: '#000' }} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Digimenu
          </Typography>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ShoppingBasketIcon />
          </IconButton>
        </Toolbar>

      </AppBar>
    </div>
  );
}
