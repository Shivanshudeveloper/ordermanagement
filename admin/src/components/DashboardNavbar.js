import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import InputIcon from '@material-ui/icons/Input';
import Logo from './Logo';
import { auth } from '../Firebase';

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const navigate = useNavigate();
  const logOut = () => {
    auth.signOut()
      .then(() => {
        sessionStorage.setItem('userId', '');
        sessionStorage.setItem('userEmail', '');
        console.log('Successfully signed out.');
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.log(error);
        console.log('An error occurred');
      });
  };
  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden xlDown>
          <IconButton onClick={logOut} color="inherit" size="large">
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
