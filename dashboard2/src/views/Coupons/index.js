import {
    Box,
    Container,
    TextField,
    Button,
    Table,
    TableRow,
    Dialog,
    DialogActions,
    Typography,
    TableHead,
    TableCell,
    TableBody,
    Chip,
    Snackbar,
    Alert,
    Tooltip,
    IconButton
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_SERVICE } from 'URI';
/* eslint no-underscore-dangle: 0 */

function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [coupon, setCoupon] = useState({ couponCode: '', discount: '' });
    const [User, setUser] = useState({ email: '' });
    const [open, setOpen] = useState(false);
    const [percent, setPercent] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [error, setError] = useState({ error: false, message: '' });
    const setCouponHandler = async () => {
        if (coupon.couponCode === '' || coupon.discount === '') {
            setError({ error: true, message: "Field can't be Empty" });
            setShowSnackbar(true);
            return;
        }
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/coupons/addcoupon`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    discount: coupon.discount + (percent ? ' %' : ' $'),
                    email: User.email,
                    couponCode: coupon.couponCode
                })
            });
            console.log(coupon);
            const content = await rawResponse.json();
            console.log(content);
            setCoupons((old) => [...old, content]);
            setCoupon({ couponCode: '', discount: '' });
            setError({ error: false, message: '' });
        } catch (err) {
            console.log(err);
            setCoupon({ couponCode: '', discount: '' });
        }
        setOpen(false);
    };
    const deleteCoupon = async (cop) => {
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/coupons/removecoupon/${cop._id}`, {
                method: 'delete'
            });
            const res = await rawResponse.json();
            console.log(res);
            const filteredCoupons = coupons.filter((c) => c._id !== cop._id);
            setCoupons(filteredCoupons);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getCoupons = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/coupons/getcoupons/${User.email}`);
                const content = await rawResponse.json();
                console.log(content);
                setCoupons(content);
            } catch (err) {
                console.log(err);
            }
        };

        getCoupons();
    }, [User]);
    const userEmail = getSessionStorageOrDefault('userEmail', '');
    const navigate = useNavigate();
    useEffect(() => {
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/pages/login/login3', { replace: true });
        }
    }, []);
    return (
        <>
            <Helmet>
                <title>Coupons | Material Kit</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'background.default',

                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        m: 3,
                        mb: 0
                    }}
                >
                    <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
                        Coupons
                    </Typography>

                    <Button variant="contained" component="label" onClick={() => setOpen(true)}>
                        Add Coupon
                    </Button>
                </Box>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            autoFocus
                            value={coupon.couponCode}
                            error={coupon.couponCode === '' && error.error}
                            helperText={coupon.couponCode === '' && error.error ? 'Empty field!' : ' '}
                            margin="dense"
                            id="name"
                            label="Coupon Code"
                            type="text"
                            sx={{ m: 5 }}
                            onChange={(e) => setCoupon((prev) => ({ ...prev, couponCode: e.target.value }))}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                variant={percent ? 'contained' : 'outlined'}
                                component="label"
                                sx={{ fontSize: '1.5em', m: 2, mt: 0 }}
                                onClick={() => {
                                    setPercent(true);
                                }}
                            >
                                %
                            </Button>
                            <Button
                                variant={!percent ? 'contained' : 'outlined'}
                                component="label"
                                sx={{ fontSize: '1.5em', m: 2, mt: 0 }}
                                onClick={() => {
                                    setPercent(false);
                                }}
                            >
                                $
                            </Button>
                            <TextField
                                value={coupon.discount}
                                error={coupon.discount === '' && error.error}
                                helperText={coupon.discount === '' && error.error ? 'Empty field!' : ' '}
                                margin="dense"
                                id="name"
                                label={percent ? 'Discount in %' : 'Discount in $'}
                                type="text"
                                sx={{ m: 5 }}
                                onChange={(e) => setCoupon((prev) => ({ ...prev, discount: e.target.value }))}
                            />
                        </Box>

                        <Button
                            disabled={coupon.discount === '' || coupon.couponCode === ''}
                            onClick={setCouponHandler}
                            variant="contained"
                            component="label"
                        >
                            Add
                        </Button>
                    </Box>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={showSnackbar} autoHideDuration={6000} sx={{ ml: 30 }} onClose={() => setShowSnackbar(false)}>
                    <Alert onClose={() => setShowSnackbar(false)} severity={error.error ? 'warning' : 'success'} sx={{ width: '100%' }}>
                        {error.message}
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        minHeight: '200px',
                        maxHeight: '400px',
                        py: 3,
                        mt: 5,
                        ml: 10,
                        mr: 10,

                        overflow: 'scroll',
                        overflowX: 'hidden'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Coupon Code</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coupons.map((cop, id) => (
                                <>
                                    <TableRow hover key={IDBCursor}>
                                        <TableCell>{cop.couponCode}</TableCell>

                                        <TableCell>{cop.discount}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Delete Coupon">
                                                <IconButton
                                                    sx={{ color: 'rgb(205,10,10)' }}
                                                    onClick={() => deleteCoupon(cop)}
                                                    component="span"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </>
    );
};

export default Coupons;
