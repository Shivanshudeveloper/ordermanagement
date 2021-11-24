import { Link as RouterLink, useNavigate,useLocation} from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,

  TextField,
  Typography,Alert,Snackbar
} from "@material-ui/core";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useState,useEffect} from "react";
import { API_SERVICE } from '../../URI';

const Register = (props) => {
  const location=useLocation();
  const navigate = useNavigate();
 const [showSnackBar,setShowSnackBar]=useState({show:false,error:false,message:''});
 const [Query,setQuery]=useState("");
 const [orderDone,setOrderDone]=useState(false);
 console.log("hii",location);
  const register = (values, { setErrors, setSubmitting }) => {
 
    const { firstName, lastName, password, email } = values;
    fetch(`${API_SERVICE}/api/v1/main/auth/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      }),
    })
      .then((res) => res.json())
      .then(async(res) => {
        console.log(res);
        let vars = Query.split("&");
        let Email = vars[0].split("=")[1];
    
        let title = vars[2].split("=")[1];
        if(location.state!==null){
          await fetch(`${API_SERVICE}/api/v1/main/order/addorder`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              orders: location.state.cart,
              firstName: firstName,
              lastName: lastName,
              email: email,
              adminEmail: Email,
              totalamount: location.state.total,
              status: "Order Preparing",
              type: location.state.type,
              payment:"Pending"
            }),
          });
          setOrderDone(true);
        }

        if(res.code===11000){
          setSubmitting(false);
          setShowSnackBar({show:true,error:true,message:"Email Already Exists"});
        }else{
          setShowSnackBar({show:true,error:false,message:"Successfully Registered"}); 
          setTimeout(()=>{
            navigate(`/mobile/signin/?${Query}`);
           },2300);
        }
    }).catch(err=>{
     
   setSubmitting(false);
        console.log(err);
        setShowSnackBar({show:true,error:true,message:"Error !"});
      });

      
  };
  useEffect(()=>{
    let query = window.location.search.substring(1);
    setQuery(query);
  },[])

if(orderDone){
  return(    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      height: "100vh",
      alignItems: "center",
      justifyContent:"center"
    }}
  >
    <Typography sx={{ mt: 0 }} variant="h3" color="green">
      Thank you! 
    </Typography>
    
    <Typography sx={{textAlign:"center"}} variant="h3" color="green">
      Your order was successfully submitted!
    </Typography>
    <img
      src="https://res.cloudinary.com/dx9dnqzaj/image/upload/v1637056151/ordermanagement/f0ca90dd6924e009d86f4421cf2032b5_b3aokt.gif"
      alt=""
      width="100%"
      height="50%"
    />

    <Typography variant="h4">Order is Preparing</Typography>

  
  </Box>)
}
  return (
    <>
      <Helmet>
        <title>Register </title>
      </Helmet>
      <Button sx={{m:0,mt:1,p:0}} onClick={()=>navigate(`/mobile/signin/?${Query}`)}><ArrowBackIcon sx={{fontSize:"2.2em"}}  /></Button>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center"
        }}
      >
            
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              firstName: "",
              lastName: "",
              password: "",

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
              password: Yup.string().max(255).required("password is required"),
            })}
            onSubmit={register}
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
                    Register
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create account
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
         
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>{errors.policy}</FormHelperText>
                )}
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Register Now  
                  </Button>
                </Box>
             
              </form>
            )}
          </Formik>
          <Snackbar open={showSnackBar.show} autoHideDuration={6000} onClose={()=>setShowSnackBar(false)}>
      
         <Alert onClose={()=>setShowSnackBar({show:false,error:false,message:''})} severity={showSnackBar.error?"error":"success"} sx={{ width: '100%' }}>
         {showSnackBar.message}
         </Alert>
     
      </Snackbar>

        </Container>
      </Box>
    </>
  );
};

export default Register;
