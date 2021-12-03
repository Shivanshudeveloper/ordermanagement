import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    MenuItem,
    InputLabel,
    Select,
    Paper,
    IconButton,
    Divider,
    InputBase,
    CardContent,
    Card,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert,
    Input,
    InputAdornment
} from '@mui/material';

import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import firebase from '../../Firebase/index';

import { useState, useEffect } from 'react';
import { API_SERVICE } from '../../URI';

const MenuListToolbar = (props) => {
    const { handleClickOpen, handleClose, setMenuListHandler, open, User, restaurantName, searchHandler, setCategoryHandler } = props;
    const [menu, setMenu] = useState({
        item: '',
        price: null,
        discount: '',
        category: '',
        description: '',
        image: ''
    });
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [itemImage, setItemImage] = useState(null);
    const [loading, setloading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [error, setError] = useState({ error: false, message: '' });
    const handleChange = (e) => {
        setMenu({ ...menu, category: e.target.value });
    };
    const handleUpdateItemImage = () => {
        const storage = firebase.storage();
        console.log(storage);
        const uploadTask = storage.ref(`itemImage/${itemImage.name}`).put(itemImage);
        uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
                setError({ error: true, message: error.message });
                setShowSnackbar(true);
                console.log(error);
            },
            () => {
                storage
                    .ref('itemImage')
                    .child(itemImage.name)
                    .getDownloadURL()
                    .then((ul) => {
                        setImageUrl(ul);

                        setError({ error: false, message: '' });
                        setMenuListHandler({
                            ...menu,
                            email: User.email,
                            restaurantName,
                            userID: User.uid,
                            image: ul
                        });
                        handleClose({
                            ...menu,
                            email: User.email,
                            restaurantName,
                            userID: User.uid,
                            image: ul
                        });
                        setMenu({
                            item: '',
                            price: null,
                            discount: '',
                            category: '',
                            description: '',
                            image: ''
                        });
                        setloading(false);
                    })
                    .catch((err) => {
                        setError({ error: true, message: error.message });
                        setShowSnackbar(true);
                        console.log(err);
                    });
            }
        );
    };
    useEffect(() => {
        const getCategories = async () => {
            if (categories.length !== 0) return;
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/getcategories/${User.email}`);
                const content = await rawResponse.json();

                setCategories(content);
            } catch (err) {
                setError({ error: true, message: error.message });
                setShowSnackbar(true);
            }
        };

        getCategories();
    }, [User]);
    const searchValueHandle = (e) => {
        searchHandler(e.target.value);
    };
    const imageChangeHandler = (e) => {
        e.preventDefault();
        setItemImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    const check = () => {
        if (
            menu.item === '' ||
            menu.price === null ||
            menu.discount === '' ||
            menu.category === '' ||
            menu.description === '' ||
            imageUrl === null
        ) {
            if (imageUrl === null) {
                setError({ error: true, message: 'Please Choose Image' });
                setShowSnackbar(true);
                setloading(false);
                return;
            }
            setError({ error: true, message: "Field can't be Empty" });
            setShowSnackbar(true);
            setloading(false);
            return;
        }
        setError({ error: false, message: '' });
        handleUpdateItemImage();
        if (itemImage === null) {
            const m = menu;
            setMenu({
                item: '',
                price: null,
                discount: '',
                category: '',
                description: '',
                image: ''
            });
            setMenuListHandler({
                ...m,
                email: User.email,
                restaurantName,
                userID: User.uid,
                image: imageUrl
            });
            handleClose({
                ...m,
                email: User.email,
                restaurantName,
                userID: User.uid,
                image: imageUrl
            });
        }
    };
    useEffect(() => {
        setError({ error: false, message: '' });
    }, []);

    return (
        <>
            {' '}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Paper
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 600,
                        mb: 5
                    }}
                >
                    <TextField
                        onChange={(e) => searchValueHandle(e)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Search Menu"
                        variant="outlined"
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Paper>{' '}
                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ mb: 5 }}
                        onClick={() => {
                            setImageUrl(null);
                            handleClickOpen();
                        }}
                    >
                        Add Menu
                    </Button>
                </Box>
                <Dialog open={open} fullWidth onClose={() => handleClose(null)}>
                    <DialogTitle>Enter Details</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Menu Item"
                            type="text"
                            fullWidth
                            value={menu.item}
                            error={menu.item === '' && error.error}
                            helperText={menu.item === '' && error.error ? 'Empty field!' : ' '}
                            variant="standard"
                            onChange={(e) => setMenu({ ...menu, item: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Price of Item"
                            type="text"
                            fullWidth
                            value={menu.price}
                            error={menu.price === null && error.error}
                            helperText={menu.price === null && error.error ? 'Empty field!' : ' '}
                            variant="standard"
                            onChange={(e) => setMenu({ ...menu, price: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Discount if any"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={menu.discount}
                            error={menu.discount === '' && error.error}
                            helperText={menu.discount === '' && error.error ? 'Empty field!' : ' '}
                            onChange={(e) => setMenu({ ...menu, discount: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Add Description"
                            type="text"
                            fullWidth
                            multiline
                            minRows={3}
                            value={menu.description}
                            error={menu.description === '' && error.error}
                            helperText={menu.description === '' && error.error ? 'Empty field!' : ' '}
                            variant="standard"
                            onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                        />
                        <Box sx={{ mt: 3 }}>
                            <InputLabel id="demo-simple-select-label">Select Category</InputLabel>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                label="Category"
                                value={menu.category}
                                onChange={handleChange}
                            >
                                {categories?.map((cat) => (
                                    <MenuItem value={cat.category} key={cat.category}>
                                        {cat.category}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Card sx={{ marginTop: '20px' }}>
                                <CardContent sx={{ height: '200px' }}>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={imageUrl !== null ? imageUrl : itemImage}
                                            sx={{
                                                height: 100,
                                                width: 100
                                            }}
                                        />
                                    </Box>
                                </CardContent>

                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        mb: 4
                                    }}
                                >
                                    <Button variant="contained" component="label">
                                        Choose Item Image
                                        <input type="file" hidden onChange={imageChangeHandler} />
                                    </Button>
                                </Box>
                            </Card>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                setError({ error: false, message: '' });
                                setMenu({
                                    item: '',
                                    price: null,
                                    discount: '',
                                    category: '',
                                    description: '',
                                    image: ''
                                });
                                setloading(false);
                                handleClose(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setloading(true);
                                check();
                            }}
                        >
                            Add {loading && <CircularProgress />}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Snackbar open={showSnackbar} autoHideDuration={6000} sx={{ ml: 30 }} onClose={() => setShowSnackbar(false)}>
                <Alert onClose={() => setShowSnackbar(false)} severity={error.error ? 'warning' : 'success'} sx={{ width: '100%' }}>
                    {error.message}
                </Alert>
            </Snackbar>
        </>
    );
};
MenuListToolbar.propTypes = {
    handleClickOpen: PropTypes.func,
    handleClose: PropTypes.func,
    setCategoryHandler: PropTypes.func,
    open: PropTypes.bool,
    User: PropTypes.object,
    restaurantName: PropTypes.any,
    searchHandler: PropTypes.func
};
export default MenuListToolbar;
