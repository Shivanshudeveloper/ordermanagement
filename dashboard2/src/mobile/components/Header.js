import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SwipeableDrawer, ListItemIcon, ListItem, ListItemText, List, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from 'react-router-dom';
import { useState, React } from 'react';
import { withStyles, makeStyles } from '@mui/styles';

import LoginIcon from '@mui/icons-material/Login';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { API_SERVICE } from '../../URI';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1,
        // marginLeft: '95px',

        margin: 'auto',
        width: '50%',
        padding: '10px'
    },
    countlabel: {
        color: 'green',
        fontSize: '1em'
    }
}));
const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px'
    }
}))(Badge);
export default function ButtonAppBar({ cart, user, showCartHandler, customer, setCustomerHandler }) {
    const classes = useStyles();
    const navigate = useNavigate();
    const [showDrawer, setShowDrawer] = useState(false);
    const query = window.location.search.substring(1);
    const logouthandle = () => {
        fetch(`${API_SERVICE}/api/v1/main/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setCustomerHandler(null);
                navigate(`/mobile/signin/?${query}`, { replace: true });
            })
            .catch((err) => console.log(err));
    };

    return (
        <AppBar style={{ backgroundColor: '#fff', color: '#000' }} position="sticky">
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setShowDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <SwipeableDrawer open={showDrawer} onClose={() => setShowDrawer(false)} onOpen={() => setShowDrawer(true)}>
                    <List sx={{ width: '70vw' }}>
                        {customer === null ? (
                            ['Register', 'Sign In'].map((text, index) => (
                                <ListItem
                                    button
                                    key={text}
                                    onClick={() => {
                                        if (text === 'Register') navigate('/mobile/register');
                                        else navigate('/mobile/signin');
                                    }}
                                >
                                    <ListItemIcon>{index % 2 === 0 ? <AssignmentIcon /> : <LoginIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem
                                button
                                key="Sign Out"
                                onClick={() => {
                                    logouthandle();
                                }}
                            >
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign Out" />
                            </ListItem>
                        )}
                    </List>
                </SwipeableDrawer>
                {user?.logo === '' ? (
                    <Typography variant="h4" className={classes.title} sx={{ color: 'black' }}>
                        {user?.restaurantName}
                    </Typography>
                ) : (
                    <Box className={classes.title}>
                        <img src={user?.logo} width="30px" height="30px" alt="" />
                    </Box>
                )}

                <IconButton onClick={() => showCartHandler(true)} aria-label="cart">
                    <StyledBadge badgeContent={cart.length} color="secondary">
                        <ShoppingCartIcon sx={{ width: '40px', height: '40px' }} />
                    </StyledBadge>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
