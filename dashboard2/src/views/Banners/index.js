import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    CardContent,
    Card,
    Chip,
    ImageList,
    DialogActions,
    ImageListItem,
    ImageListItemBar,
    Slide,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Select,
    MenuItem,
    TextField,
    Tooltip,
    Grid,
    CardMedia,
    CardActions
} from '@mui/material';
import { useState, useEffect, forwardRef } from 'react';
import firebase from '../../Firebase/index';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { API_SERVICE } from 'URI';
/* eslint no-underscore-dangle: 0 */
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
function getSessionStorageOrDefault(key, defaultValue) {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }

    return stored;
}
const Banners = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [User, setUser] = useState({ displayName: '', email: '' });
    const [banners, setBanners] = useState([]);
    const [deleteBanner, setDeleteBanner] = useState(null);
    const [showBannerDetails, setShowBannerDetails] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState({});
    const [openDeleteBannerPrompt, setOpenDeleteBannerPrompt] = useState(false);
    const [TandC, setTandC] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [bannersDetails, setBannersDetails] = useState(null);

    const userEmail = getSessionStorageOrDefault('userEmail', '');

    useEffect(() => {
        setUser({ email: userEmail });
        if (userEmail === '') {
            navigate('/pages/login/login3', { replace: true });
        }
    }, []);
    useEffect(() => {
        const getCoupons = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/coupons/getcoupons/${User.email}`);
                const content = await rawResponse.json();

                setCoupons(content);
            } catch (err) {
                console.log(err);
            }
        };

        getCoupons();
    }, [User]);
    const uploadBanner = async (ul) => {
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/banners/addbanner`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    banner: ul,
                    email: User.email,
                    name: image.name,
                    TandC,
                    coupon: selectedCoupon
                })
            });
            const content = await rawResponse.json();
            console.log(content);
            setBanners((old) => [...old, content]);
            setImageUrl('');
            setImage('');
            setTandC('');
            setSelectedCoupon({});
            setOpen(false);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setImageUrl('');
            setImage('');
            setOpen(false);
        }
    };
    const updateBanner = async (ul) => {
        console.log(bannersDetails);
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/banners/updatebanner/${bannersDetails?._id}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    banner: ul,
                    email: User.email,
                    TandC,
                    coupon: selectedCoupon
                })
            });
            const content = await rawResponse.json();
            console.log(content);
            window.location.reload();

            setTimeout(() => {
                setOpenEdit(false);
                setBanners((old) => [...old, content]);
                setImageUrl('');
                setImage('');
                setTandC('');
                setSelectedCoupon({});
                setBannersDetails(null);
                setLoading(false);
            }, 2000);
        } catch (err) {
            console.log(err);
            setImageUrl('');
            setImage('');
            setOpenEdit(false);
        }
    };
    const handleUpdateItemImage = () => {
        const storage = firebase.storage();
        setLoading(true);
        const uploadTask = storage.ref(`banners/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref('banners')
                    .child(image.name)
                    .getDownloadURL()
                    .then((ul) => {
                        setImageUrl(ul);
                        uploadBanner(ul);
                    });
            }
        );
    };
    const handleUpdateItemImageUpdate = () => {
        const storage = firebase.storage();
        setLoading(true);
        if (image === '') {
            updateBanner(bannersDetails?.banner);
            return;
        }
        const uploadTask = storage.ref(`banners/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref('banners')
                    .child(image.name)
                    .getDownloadURL()
                    .then((ul) => {
                        setImageUrl(ul);
                        updateBanner(ul);
                    });
            }
        );
    };
    useEffect(() => {
        const getBanners = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/banners/getbanners/${User.email}`);
                const content = await rawResponse.json();
                console.log(content);
                setBanners(content);
            } catch (err) {
                console.log(err);
            }
        };

        getBanners();
    }, [User]);
    const handleDeleteBanner = async () => {
        if (deleteBanner === null) {
            setOpenDeleteBannerPrompt(false);
            return;
        }
        try {
            const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/banners/removebanner/${deleteBanner._id}`, {
                method: 'delete'
            });
            const res = await rawResponse.json();
            console.log(res);
            const newBan = banners.filter((bannner) => bannner._id !== deleteBanner._id);
            setBanners(newBan);
            setOpenDeleteBannerPrompt(false);
            setDeleteBanner(null);
        } catch (err) {
            setOpenDeleteBannerPrompt(false);
            console.log(err);
            setDeleteBanner(null);
        }
    };
    const imageChangeHandler = (e) => {
        e.preventDefault();
        setImage(e.target.files[0]);

        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    const addBanner = () => {
        if (image !== '') handleUpdateItemImage();
    };
    const updateBannerHandler = () => {
        handleUpdateItemImageUpdate();
    };
    const closeBanner = () => {
        setImageUrl('');
        setImage('');
        setOpen(false);
        setTandC('');
        setSelectedCoupon({});
        setOpenEdit(false);
    };
    useEffect(() => {
        if (openEdit) {
            if (!selectedCoupon.couponCode) {
                setSelectedCoupon({ couponCode: bannersDetails?.coupon.couponCode, discount: bannersDetails?.coupon.discount });
            }
            if (!TandC) {
                setTandC(bannersDetails?.TandC);
            }
        }
    }, [openEdit]);

    /* eslint-disable */

    return (
        <>
            <Helmet>
                <title>Banners</title>
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
                        mb: 5
                    }}
                >
                    <Typography color="textPrimary" variant="h2" sx={{ mb: 5 }}>
                        Banners
                    </Typography>

                    <Button variant="contained" component="label" onClick={() => setOpen(true)}>
                        Add Banner
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {banners.map((item) => (
                        <Grid item xs={2} sm={3} md={3}>
                            <Item>
                                <Card sx={{ Width: 345, height: 600, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia component="img" image={item.banner} alt="green iguana" />
                                    <CardContent sx={{ p: 1, mb: 0 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography gutterBottom variant="h6" component="div">
                                                Coupon Code
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {item?.coupon.couponCode + ' ' + item?.coupon.discount}
                                            </Typography>
                                        </Box>
                                        {item?.TandC !== '' ? (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    Terms and Conditions
                                                </Typography>
                                                <Typography sx={{ textAlign: 'justify' }} variant="body2" color="text.secondary">
                                                    {item?.TandC}
                                                </Typography>
                                            </Box>
                                        ) : null}
                                    </CardContent>
                                    <CardActions
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                            alignSelf: 'stretch'
                                        }}
                                    >
                                        <Tooltip title="Edit Banner">
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setBannersDetails(item);
                                                    setOpenEdit(true);
                                                }}
                                                component="span"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Banner">
                                            <IconButton
                                                sx={{ color: 'rgb(205,10,10)' }}
                                                onClick={() => {
                                                    setDeleteBanner(item);
                                                    setOpenDeleteBannerPrompt(true);
                                                }}
                                                component="span"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
                <Dialog fullScreen open={showBannerDetails} onClose={() => setShowBannerDetails(false)} TransitionComponent={Transition}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Offer Details
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={() => setShowBannerDetails(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>

                    <List>
                        <ListItem button>
                            <ListItemText
                                primary="Coupon Name"
                                secondary={bannersDetails?.coupon.couponCode + ' ' + bannersDetails?.coupon.discount}
                            />
                        </ListItem>
                        <Divider />

                        <ListItem button>
                            <ListItemText primary={'Terms & Conditions'} secondary={bannersDetails?.TandC} />
                        </ListItem>
                    </List>
                </Dialog>
                <Dialog open={open} fullWidth onClose={() => {}}>
                    <DialogTitle>Banner</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 3 }}>
                            <Card sx={{ marginTop: '20px' }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <img alt="" variant="rounded" src={imageUrl} width="500px" />
                                    </Box>
                                </CardContent>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        m: 1
                                    }}
                                >
                                    <Button variant="contained" component="label" sx={{ mb: 3 }}>
                                        Choose Banner
                                        <input type="file" hidden onChange={(e) => imageChangeHandler(e)} />
                                    </Button>
                                    <Typography align="left" color="textPrimary" variant="subtitle1">
                                        Select Coupon Name
                                    </Typography>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        label="Category"
                                        value={selectedCoupon.couponCode}
                                        sx={{ mb: 3 }}
                                        onChange={(e) => {
                                            setSelectedCoupon(coupons.find((ele) => ele.couponCode === e.target.value));
                                        }}
                                    >
                                        {coupons?.map((cat) => {
                                            return (
                                                <MenuItem
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }}
                                                    value={cat.couponCode}
                                                    key={cat}
                                                >
                                                    <label> {cat.couponCode}</label>
                                                    <label> {cat.discount}</label>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    <Typography align="left" color="textPrimary" variant="subtitle1">
                                        Write Terms and Condition
                                    </Typography>
                                    <textarea
                                        value={TandC}
                                        style={{ minHeight: '100px', fontSize: '1.3em' }}
                                        onChange={(e) => setTandC(e.target.value)}
                                    />
                                </Box>
                            </Card>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                closeBanner();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={image === ''}
                            onClick={() => {
                                addBanner();
                            }}
                        >
                            Add {loading && <CircularProgress />}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openEdit} fullWidth onClose={() => {}}>
                    <DialogTitle>Banner</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 3 }}>
                            <Card sx={{ marginTop: '20px' }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <img alt="" variant="rounded" src={imageUrl ? imageUrl : bannersDetails?.banner} width="500px" />
                                    </Box>
                                </CardContent>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        m: 1
                                    }}
                                >
                                    <Button variant="contained" component="label" sx={{ mb: 3 }}>
                                        Change Banner
                                        <input type="file" hidden onChange={(e) => imageChangeHandler(e)} />
                                    </Button>
                                    <Typography align="left" color="textPrimary" variant="subtitle1">
                                        Select Coupon Name
                                    </Typography>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        label="Category"
                                        value={selectedCoupon.couponCode ? selectedCoupon.couponCode : bannersDetails?.coupon.couponCode}
                                        sx={{ mb: 3 }}
                                        onChange={(e) => {
                                            setSelectedCoupon(coupons.find((ele) => ele.couponCode === e.target.value));
                                        }}
                                    >
                                        {coupons?.map((cat) => {
                                            return (
                                                <MenuItem
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between'
                                                    }}
                                                    value={cat.couponCode}
                                                    key={cat}
                                                >
                                                    <label> {cat.couponCode}</label>
                                                    <label> {cat.discount}</label>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    <Typography align="left" color="textPrimary" variant="subtitle1">
                                        Write Terms and Condition
                                    </Typography>
                                    <textarea
                                        value={TandC !== '' ? TandC : bannersDetails?.TandC}
                                        style={{ minHeight: '100px', fontSize: '1.3em' }}
                                        onChange={(e) => setTandC(e.target.value)}
                                    />
                                </Box>
                            </Card>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                closeBanner();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                updateBannerHandler();
                            }}
                        >
                            Update {loading && <CircularProgress />}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDeleteBannerPrompt}
                    onClose={() => {
                        setOpenDeleteBannerPrompt(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Do you want to delete?'}</DialogTitle>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenDeleteBannerPrompt(false);
                            }}
                        >
                            NO
                        </Button>
                        <Button onClick={() => handleDeleteBanner()} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default Banners;
