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
    Container,
    Divider,
    TextField,
    Radio,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { makeStyles, styled } from '@mui/styles';
import { green } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import getUser from '../../Firebase/getUser';
import { API_SERVICE } from '../../URI';
import { validate } from 'uuid';
import Payment from '../Payment/Payment';

/* eslint no-underscore-dangle: 0 */
/* eslint no-nested-ternary: 0 */
/* eslint no-else-return: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
        borderRadius: '10px'
    }
}));
const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(green[600]),
    backgroundColor: green[600],
    '&:hover': {
        backgroundColor: green[800]
    },
    width: '95%',
    left: '2.5%'
}));
const Cart = ({ cart, showCartHandler, handleDelete, increaseQuantity, decreaseQuantity, customer, setShowPaymentHandler }) => {
    const [open, setOpen] = useState(true);

    const classes = useStyles();
    const [counter, setCounter] = useState(null);
    const [amount, setAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [nonDisTotal, setNonDisTotal] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const [adminEmail, setAdminEmail] = useState(null);
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);
    const [coupons, setCoupons] = useState([]);

    const [type, setType] = useState('Dine In');
    const navigate = useNavigate();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const findCoupon = () => {
        const index = coupons.findIndex((ele) => ele.couponCode === couponCode);

        if (index >= 0) {
            let amt = total;
            setNonDisTotal(total);

            let disc = 0;
            if (coupons[index].discount[coupons[index].discount.length - 1] === '%')
                disc = (amt * Number(coupons[index].discount.slice(0, coupons[index].discount.length - 2))) / 100;
            else disc = Number(coupons[index].discount.slice(0, coupons[index].discount.length - 2));
            amt -= disc;
            setDiscount(disc);
            setTotal(amt);
            setCouponApplied(true);
        }
    };
    const removeCoupon = () => {
        setTotal(nonDisTotal);
        setCouponApplied(false);
        setDiscount(0);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        const Email = vars[0].split('=')[1];
        const Type = vars[3].split('=')[1];
        if (Type === 'SocialMediaCampaigns') setType('Pickup');

        setAdminEmail(Email);
        const getCoupons = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/coupons/getcoupons/${Email}`);
                const content = await rawResponse.json();
                console.log(content);
                setCoupons(content);
            } catch (err) {
                console.log(err);
            }
        };

        getCoupons();
    }, []);
    useEffect(() => {
        let amt = 0;
        cart.forEach((item) => {
            amt += Number(item.selectedItem.price) * item.count;
        });
        setAmount(amt);
        setTotal(amt);
    }, [cart]);

    const checkout = () => {
        if (total === 0) return;

        setShowPaymentHandler(true, type, total);
    };

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
                <Typography color="textPrimary" variant="h3" sx={{ textAlign: 'left', m: 2, mb: 0 }}>
                    CART
                </Typography>
                <Container
                    sx={{
                        height: '400px',
                        overflow: 'scroll',
                        overflowX: 'hidden',
                        mt: 0
                    }}
                >
                    {cart?.map((menu) => (
                        <Grid key={menu.selectedItem._id} item sx={{ mb: 1, maxHeight: '100px', boxShadow: 2 }} xs={12}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleClickOpen(menu)}
                                className={classes.paper}
                            >
                                <center>
                                    <img alt="" src={menu.selectedItem.image} width="30px" height="30px" />
                                </center>
                                <h4>{menu.selectedItem.item}</h4>

                                <h5 style={{ color: 'red' }}>RM {menu.selectedItem.price}</h5>
                                <h4>{menu.count}</h4>
                                {!couponApplied ? (
                                    <Box sx={{ mr: 4, p: 0, width: '0px' }}>
                                        {' '}
                                        <ArrowDropUpIcon onClick={() => increaseQuantity(menu)} sx={{ fontSize: '2.5em' }} />
                                        <ArrowDropDownIcon onClick={() => decreaseQuantity(menu)} sx={{ fontSize: '2.5em' }} />
                                    </Box>
                                ) : null}
                                {!couponApplied ? (
                                    <Button onClick={() => handleDelete(menu)}>
                                        {' '}
                                        <DeleteIcon sx={{ color: 'red', fontSize: '2.5em' }} />
                                    </Button>
                                ) : null}
                            </Paper>{' '}
                        </Grid>
                    ))}
                </Container>

                {!showCouponInput ? (
                    <Button onClick={() => setShowCouponInput(true)}>APPLY COUPON</Button>
                ) : !couponApplied ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Coupon Code"
                            variant="outlined"
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value);
                            }}
                        />
                        <Button onClick={findCoupon}>Check</Button>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            p: 0
                        }}
                    >
                        <Box>
                            {' '}
                            <Typography>Coupon Applied</Typography>
                        </Box>
                        <Button
                            sx={{ color: 'red' }}
                            onClick={() => {
                                setCouponCode('');
                                removeCoupon();
                                setShowCouponInput(false);
                            }}
                        >
                            Remove Coupon
                        </Button>
                    </Box>
                )}
                {type === 'Pickup' || type === 'Delivery' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <label style={{ fontWeight: '900' }}>TYPE</label>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Type"
                                name="controlled-radio-buttons-group"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', m: 0 }}>
                                    <FormControlLabel value="Pickup" control={<Radio />} label="Pickup" />
                                    <FormControlLabel value="Delivery" control={<Radio />} label="Delivery" />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                ) : null}
                <Container>
                    <Typography color="textPrimary" variant="h3" sx={{ textAlign: 'left', mt: 0, fontWeight: '800' }}>
                        Bill Details
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 0, p: 0 }}>
                        <h4>Item Total </h4>
                        <h3>RM {amount}</h3>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 0, p: 0 }}>
                        <h4>Discount </h4>
                        <h3>RM {discount}</h3>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 0 }}>
                        <h2>Total </h2>
                        <h3>RM {total}</h3>
                    </Box>
                </Container>

                {customer.email === 'dummy@gmail.com' && type === 'Pickup' ? (
                    <Link
                        style={{ textDecoration: 'none' }}
                        to={`/mobile/register/?${window.location.search.substring(1)}`}
                        state={{ cart, type, total }}
                    >
                        <ColorButton sx={{ display: 'flex', justifyContent: 'space-between', m: 0 }} variant="contained">
                            {' '}
                            <Box sx={{ justifyContent: 'space-evenly', m: 1 }}>
                                <label style={{ color: 'white' }}>Total: </label>
                                <label style={{ color: 'white', fontSize: '1.3em' }}>RM {total}</label>
                            </Box>
                            <label style={{ color: 'white', fontSize: '1em' }}>Continue Checkout</label>
                        </ColorButton>
                    </Link>
                ) : (
                    <ColorButton sx={{ display: 'flex', justifyContent: 'space-between', m: 0 }} variant="contained">
                        {' '}
                        <Box onClick={checkout} sx={{ justifyContent: 'space-evenly', m: 1 }}>
                            <label style={{ color: 'white' }}>Total: </label>
                            <label style={{ color: 'white', fontSize: '1.3em' }}>RM {total}</label>
                        </Box>
                        <label style={{ color: 'white', fontSize: '1em' }} onClick={checkout}>
                            Continue Checkout
                        </label>
                    </ColorButton>
                )}
                <DialogActions>
                    <Button onClick={() => showCartHandler(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Cart;
