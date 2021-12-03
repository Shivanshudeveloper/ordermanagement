//
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Link,
    Typography,
    useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { API_SERVICE } from 'URI';
import { auth } from '../../../../Firebase/index';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);
    const register = (values, { setErrors, setSubmitting }) => {
        const { firstName, lastName, password, email, restaurantName } = values;
        const name = `${firstName} ${lastName}`;
        fetch(`${API_SERVICE}/api/v1/main/user/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: name,
                email,
                restaurantName
            })
        })
            .then((res) => res.json())
            .then((res) => {
                auth.createUserWithEmailAndPassword(email, password)
                    .then((results) => {
                        const { user } = results;

                        user.updateProfile({
                            displayName: name
                        });
                        console.log(user);
                        navigate('/pages/login/login3', { replace: true });
                    })
                    .catch((err) => {
                        setSubmitting(false);
                        setErrors({ password: err.message.replace('Firebase:', '') });
                    });
            })
            .catch((err) => console.log(err));
    };
    return (
        <>
            <Helmet>
                <title>Register | Material Kit</title>
            </Helmet>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    restaurantName: '',
                    policy: false
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    firstName: Yup.string().max(255).required('First name is required'),
                    lastName: Yup.string().max(255).required('Last name is required'),
                    password: Yup.string().max(255).required('password is required'),
                    restaurantName: Yup.string().max(255).required('password is required'),
                    policy: Yup.boolean().oneOf([true], 'This field must be checked')
                })}
                onSubmit={register}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <Typography color="textPrimary" variant="h2">
                                Create new account
                            </Typography>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                                Use your email to create new account
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(touched.firstName && errors.firstName)}
                            fullWidth
                            helperText={touched.firstName && errors.firstName}
                            label="First name"
                            margin="normal"
                            name="firstName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(touched.lastName && errors.lastName)}
                            fullWidth
                            helperText={touched.lastName && errors.lastName}
                            label="Last name"
                            margin="normal"
                            name="lastName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(touched.restaurantName && errors.restaurantName)}
                            fullWidth
                            helperText={touched.restaurantName && errors.restaurantName}
                            label="restaurant Name"
                            margin="normal"
                            name="restaurantName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.restaurantName}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            helperText={touched.email && errors.email}
                            label="Email Address"
                            margin="normal"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.email}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            label="Password"
                            margin="normal"
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="password"
                            value={values.password}
                            variant="outlined"
                        />
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                ml: -1
                            }}
                        >
                            <Checkbox checked={values.policy} name="policy" onChange={handleChange} />
                            <Typography color="textSecondary" variant="body1">
                                I have read the{' '}
                                <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6">
                                    Terms and Conditions
                                </Link>
                            </Typography>
                        </Box>
                        {Boolean(touched.policy && errors.policy) && <FormHelperText error>{errors.policy}</FormHelperText>}
                        <Box sx={{ py: 2 }}>
                            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                Sign up now
                            </Button>
                        </Box>
                        <Typography color="textSecondary" variant="body1">
                            Have an account?{' '}
                            <Link component={RouterLink} to="/pages/login/login3" variant="h6" underline="hover">
                                Sign in
                            </Link>
                        </Typography>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
