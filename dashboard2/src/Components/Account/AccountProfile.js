import { Avatar, Box, Button, Card, CardContent, Divider, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebase from '../../Firebase/index';
import { API_SERVICE } from '../../URI';

const AccountProfile = (props) => {
    const { user } = props;
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadinglogo, setLoadinglogo] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [showChooseButton, setShowChooseBUtton] = useState(true);
    const [logo, setLogo] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [showAlert, setShowAlert] = useState({
        alert: false,
        error: false,
        message: ''
    });
    const changeHandler = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        setShowChooseBUtton(false);
    };
    const logoChangeHandler = (e) => {
        console.log(e.target.files[0]);
        setLogo(e.target.files[0]);
        setLogoUrl(URL.createObjectURL(e.target.files[0]));
        setShowChooseBUtton(false);
    };
    const updateUser = (ul) => {
        const auth = getAuth();

        updateProfile(auth.currentUser, {
            photoURL: ul
        })
            .then(() => {
                console.log('PhotoUpdated');
                navigate('/account', { replace: true });
                setLoading(false);

                setShowChooseBUtton(true);
                setShowAlert({ alert: true, error: false, message: 'Photo Updated' });
            })
            .catch((error) => {
                setLoading(false);
                setShowChooseBUtton(true);
                setShowAlert({ alert: true, error: true, message: error.message });
                console.log(error);
            });
    };
    const handleUpload = () => {
        setLoading(true);
        const storage = firebase.storage();
        console.log(storage);
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then((ul) => {
                        updateUser(ul);
                    });
            }
        );
    };
    const updateLogoUrl = async (ul) => {
        try {
            const rawres = await fetch(`${API_SERVICE}/api/v1/main/user/updatelogo`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ logo: ul, email: user.email })
            });
            const content = await rawres.json();
            setLogoUrl(content[0].logo);
            console.log(content);
            navigate('/account', { replace: true });
            setLoadinglogo(false);

            setShowChooseBUtton(true);
        } catch (err) {
            console.log(err);
            navigate('/account', { replace: true });
            setLoadinglogo(false);

            setShowChooseBUtton(true);
        }
    };
    const handleUpdatelogo = () => {
        setLoadinglogo(true);
        const storage = firebase.storage();
        console.log(storage);
        const uploadTask = storage.ref(`logo/${logo.name}`).put(logo);
        uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref('logo')
                    .child(logo.name)
                    .getDownloadURL()
                    .then((ul) => {
                        updateLogoUrl(ul);
                    });
            }
        );
    };

    useEffect(() => {
        if (showAlert.alert) {
            setTimeout(() => {
                setShowAlert({ alert: false, error: false, message: '' });
            }, 1000);
        }
    }, [showAlert]);
    useEffect(() => {
        const get = async () => {
            try {
                const rawResponse = await fetch(`${API_SERVICE}/api/v1/main/user/getuser/${user.email}`);
                const content = await rawResponse.json();

                setLogoUrl(content[0].logo);
            } catch (err) {
                console.log(err);
            }
        };

        get();
    }, [user]);
    console.log(user);
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Card sx={{ mb: 15 }}>
                    <CardContent sx={{ height: '200px' }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Avatar
                                src={imageUrl !== null ? imageUrl : user.photoURL}
                                sx={{
                                    height: 100,
                                    width: 100
                                }}
                            />

                            <Typography color="textPrimary" gutterBottom variant="h3">
                                {user.displayName}
                            </Typography>
                            {loading && <CircularProgress />}
                        </Box>
                    </CardContent>

                    <Divider />
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                    >
                        {showChooseButton ? (
                            <Button variant="contained" component="label">
                                Choose Photo
                                <input type="file" hidden onChange={changeHandler} />
                            </Button>
                        ) : (
                            <Button variant="contained" component="label" onClick={handleUpload} disabled={loading}>
                                Upload Photo
                            </Button>
                        )}
                    </Box>

                    {showAlert.alert ? (
                        <Alert severity="success">
                            <AlertTitle>{showAlert.message}</AlertTitle>
                        </Alert>
                    ) : null}
                </Card>
                <Card>
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
                                src={logoUrl !== null ? logoUrl : logo}
                                sx={{
                                    height: 100,
                                    width: 100
                                }}
                            />

                            {loadinglogo && <CircularProgress />}
                        </Box>
                    </CardContent>
                    <Divider />

                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                    >
                        {showChooseButton ? (
                            <Button variant="contained" component="label">
                                Choose logo
                                <input type="file" hidden onChange={logoChangeHandler} />
                            </Button>
                        ) : (
                            <Button variant="contained" component="label" onClick={handleUpdatelogo} disabled={loadinglogo}>
                                Update logo
                            </Button>
                        )}
                    </Box>
                </Card>
            </Box>
        </>
    );
};
AccountProfile.propTypes = {
    user: PropTypes.any
};
export default AccountProfile;
