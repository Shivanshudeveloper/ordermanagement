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
  CardContent,
} from "@material-ui/core";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_SERVICE } from "../../URI";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardInput from "../components/CardInput";
const Payment = ({ customer, cart, type, total, setShowPaymentHandler,setPaymentPendingHandler }) => {
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

  const [paysubmit, setPaySubmit] = useState(false);
  const [open, setOpen] = useState(false);

  const [paymentDone, setPaymentDone] = useState(false);
  const [guest, setGuest] = useState(false);
  const stripe = useStripe();

  const elements = useElements();
  const pay = (values, { setErrors, setSubmitting }) => {
    const { email, firstName, lastName } = values;

    confirmPayment(email, firstName, lastName);
  };
  const confirmPayment = async (email, firstName, lastName) => {
    if (!stripe || !elements) {
      return;
    }
    setPaySubmit(true);

    let query = window.location.search.substring(1);

    let vars = query.split("&");
    let Email = vars[0].split("=")[1];

    let title = vars[2].split("=")[1];
    const RAWRES=  await fetch(`${API_SERVICE}/api/v1/main/order/getpendingorder/${email}`);
    const Orders=await RAWRES.json();
    if(Orders.length===0)
    {
      try {
        await fetch(`${API_SERVICE}/api/v1/main/order/addorder`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            orders: cart,
            firstName: firstName,
            lastName: lastName,
            email: email,
            adminEmail: Email,
            totalamount: total,
            status: "Order Preparing",
            type: type,
            payment: "Done",
          }),
        });
      } catch (err) {
        console.log(err);
      }
    }else{
      try {
        await fetch(`${API_SERVICE}/api/v1/main/order/updatependingorder/?id=${Orders[0]._id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const raw = await fetch(`${API_SERVICE}/api/v1/main/charges`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: total,
        }),
      });

      const res = await raw.json();
      let clientSecret = res.cc;

      try {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: email,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
    handleClick();

    setPaySubmit(false);
    setPaymentDone(true);
  };
  const handleClick = () => {
    setOpen(true);
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
    let vars = query.split("&");
    let Email = vars[0].split("=")[1];

    setUser((old) => ({ ...old, email: Email }));

    setQuery(query);
  }, []);
  useEffect(() => {
    if (!guest && customer?.email === "dummy@gmail.com") setGuest(true);
  }, [customer]);
  if (loading) {
    return <div>Loading</div>;
  } else if (paymentDone) {
    return (
      <>
        <Helmet>
          <title>payment Succesfully Done</title>
        </Helmet>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            height: "100vh",
            alignItems: "center",
          }}
        >
          <Typography sx={{ mt: 10 }} variant="h3" color="green">
            Payment Successfully Done
          </Typography>
          <img
            src="https://res.cloudinary.com/dx9dnqzaj/image/upload/v1637056151/ordermanagement/f0ca90dd6924e009d86f4421cf2032b5_b3aokt.gif"
            alt=""
            width="100%"
            height="50%"
          />

          <Typography variant="h4">Order is Preparing</Typography>

          <Link
            sx={{ mt: 10 }}
            component="button"
            variant="h4"
            onClick={() => {
              setPaymentPendingHandler(false);
              setShowPaymentHandler(false, null, null);
            }}
          >
            Home
          </Link>
        </Box>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Payment </title>
      </Helmet>
      <Button
        sx={{ m: 0, mt: 1, p: 0 }}
        onClick={() => setShowPaymentHandler(false, null, null)}
      >
        <ArrowBackIcon sx={{ fontSize: "2.2em" }} />
      </Button>
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
              email: guest ? "" : customer.email,
              firstName: guest ? "" : customer.firstName,
              lastName: guest ? "" : customer.lastName,
              amount: total,
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
            onSubmit={pay}
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
                  disabled={!guest}
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
                  disabled={!guest}
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
                  disabled={!guest}
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
                  value={values.amount + " RM"}
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

                <Box sx={{ py: 2, display: "flex", flexDirection: "column" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={paysubmit}
                  >
                    {paysubmit ? "Confirming Payment" : "Pay"}
                  </Button>
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
