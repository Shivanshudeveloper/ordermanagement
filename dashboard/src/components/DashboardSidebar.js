
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import CategoryIcon from '@material-ui/icons/Category';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
const user = {
  avatar: '',
  jobTitle: '',
  name: ''
};

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/reports',
    icon: ShowChartIcon,
    title: 'Reports'
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'Customers'
  },
  {
    href: '/app/menu',
    icon: ShoppingBagIcon,
    title: 'Menu'
  },
  {
    href: '/app/orders',
    icon: FastfoodIcon,
    title: 'Orders'
  },
  {
    href: '/app/categories',
    icon: CategoryIcon,
    title: 'categories'
  },
  {
    href: '/app/templates',
    icon: ChangeHistoryIcon,
    title: 'templates'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const [restaurantName,setRestaurantName]=useState("");
  const [User, setUser] = useState({ displayName: '', photoURL: '' });
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);

        setUser(user);
      } else {
        // ...
      }
    });
  }, []);
  useEffect(()=>{
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();
       console.log(content);
        setRestaurantName(content[0].restaurantName);
      
      } catch (err) {
        console.log(err);
      }
    };
    get();
  },[User])
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={User.photoURL}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {User.displayName}    
        </Typography>
        <Typography color="textPrimary" variant="h5">
        {restaurantName}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden xlDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false
};

export default DashboardSidebar;
