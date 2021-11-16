import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CardContent
} from "@material-ui/core";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_SERVICE } from "../../URI";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardInput from "../components/CardInput";
const Payment = () => {
  const navigate = useNavigate();
  const [showPopper, setShowPopper] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [Query, setQuery] = useState("");
  const [user, setUser] = useState({ email: "", username: "" });
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [paysubmit, setPaySubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const login = (values, { setErrors, setSubmitting }) => {
    const { email } = values;
  };
  const confirmPayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setPaySubmit(true);

    const raw = await fetch(`${API_SERVICE}/api/v1/main/charges`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:user.email,
          amount:amount
        })
      });
    
     const res=await raw.json();
    let clientSecret=res.cc;
  
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: user.email,
        },
      },
    });

    handleClick();
    let query = window.location.search.substring(1);

   setTimeout(()=>{
        navigate(`/mobile/?${query}`, { replace: true });
   },2000);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpenR(false);
  };
  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/user/getuser/${user.email}`
        );
        const content = await rawResponse.json();

        console.log(content[0]);
        setUser(content[0]);
        setUser((old) => ({ ...old, username: content[0].username }));
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    get();
  }, [Query]);
  useEffect(() => {
    let query = window.location.search.substring(1);

    console.log(query);
    let vars = query.split("&");

    let Email = vars[0].split("=")[1];
    let id = vars[1].split("=")[1];
    let amt=vars[3].split("=")[1];
    setUser((old) => ({ ...old, email: Email }));
    setAmount(amt);
    setQuery(query);
  }, []);
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: user?.email,
              firstName: user?.username?.split(" ")[0],
              lastName: user?.username?.split(" ")[1],
              amount:amount
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              firstName: Yup.string()
                .max(255)
                .required("First name is required"),
              lastName: Yup.string().max(255).required("Last name is required"),
              amount: Yup.string().max(255).required("Last name is required"),
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
                    Payment
                  </Typography>
                </Box>

                <Box
                  sx={{
                    pb: 1,
                    pt: 3,
                  }}
                ></Box>
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
                  disabled={true}
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First name"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  disabled={true}
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
                  disabled={true}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
                 <TextField
                  error={Boolean(touched.amount && errors.amount)}
                  fullWidth
                  helperText={touched.amount && errors.amount}
                  label="Amount"
                  margin="normal"
                  name="Amount"
                  disabled={true}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount+" RM"}
                  variant="outlined"
                />
                <Box>
                  <h6 className="text-center font-weight-bold">Card Details</h6>
                  <CardContent>
                    <CardInput />
                  </CardContent>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="customCheck1"
                  />
                  <label>I Accept Terms And Condition</label>
                </Box>

                <Box sx={{ py: 2,display:"flex",flexDirection:"column"}}>
                  <Button
                    variant="contained"
                    onClick={confirmPayment}
                    disabled={paysubmit}
                  >
                    {paysubmit ? "Confirming Payment" : "Pay"}
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="success"
                      elevation={6}
                      variant="filled"
                    >
                      Payment Successfull!
                    </Alert>
                  </Snackbar>
                </Box>

                <Typography color="textSecondary" variant="body1"></Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Payment;
