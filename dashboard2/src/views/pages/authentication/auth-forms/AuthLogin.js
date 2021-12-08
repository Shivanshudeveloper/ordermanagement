import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
// material-ui
import { useTheme } from "@mui/material/styles";
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
  Stack,
  Typography,
  Link,
  TextField,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import { API_SERVICE } from "URI";
// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../../../../Firebase/index";
// project imports
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Google from "assets/images/icons/social-google.svg";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const [notify, setNotify] = useState({ open: false, message: "" });
  const navigate = useNavigate();
  const [showPopper, setShowPopper] = useState(false);
  const googleHandler = async () => {
    console.error("Login");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClose = () => {
    setNotify({ open: false, message: "" });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const checkUser = async (user) => {
    const rawResponse = await fetch(
      `${API_SERVICE}/api/v1/main/user/getuser/${user.email}`
    );
    const content = await rawResponse.json();
    console.log(content[0]);
    if (content[0].access) {
      navigate("/dashboard/default", { replace: true });
    } else {
      setNotify({ open: true, message: "You are Blocked" });
    }
  };
  const login = (values, { setErrors, setSubmitting }) => {
    const { password, email } = values;
    console.log(password, email);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email);

            checkUser(user);

            setSubmitting(false);
          }
        });
      })
      .catch((error) => {
        setErrors({ password: error.message });
        console.log(error);
        setSubmitting(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign in with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={login}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography color="textPrimary" variant="h2">
                Sign in
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Sign in on the internal platform
              </Typography>
            </Box>

            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                login with email address
              </Typography>
            </Box>
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
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign in now
              </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to="/pages/register/register3"
                variant="h6"
                underline="hover"
              >
                Sign up
              </Link>
            </Typography>
            <Typography color="textSecondary" variant="body1">
              {showPopper ? (
                <Box
                  sx={{
                    border: 1,
                    p: 1,
                    bgcolor: "background.paper",
                    color: "green",
                  }}
                >
                  {" "}
                  We have sent a Verification Link on your Email Address
                </Box>
              ) : null}
            </Typography>
          </form>
        )}
      </Formik>
      <Snackbar
        open={notify.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={notify.message}
      />
    </>
  );
};

export default FirebaseLogin;
