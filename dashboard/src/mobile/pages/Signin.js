import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,Snackbar,Alert
} from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const Signin = () => {
  const navigate = useNavigate();
  const [showPopper, setShowPopper] = useState(false);
  const [showSnackBar,setShowSnackBar]=useState({show:false,error:false,message:''});
  const login = (values, { setErrors, setSubmitting }) => {
  
    const { password, email } = values;
    fetch("http://localhost:5000/api/v1/main/auth/signin", {
      method: "POST",
      credentials: 'include', 
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((res) => {
        
        if(!res.success){
          setSubmitting(false);
          setShowSnackBar({show:true,error:true,message:res.message});
        }else{
         
          setShowSnackBar({show:true,error:false,message:res.message}); 
          setTimeout(()=>{
            navigate("/mobile",{replace:true});
           },1500);
        }
   
          
    }).catch(err=>{
     
        console.log(err);
        setShowSnackBar({show:true,error:true,message:"Error !"});
      });
  };
  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Button sx={{m:0,p:0}} onClick={()=>navigate("/mobile",{replace:true})}><ArrowBackIcon sx={{fontSize:"2.2em"}}  /></Button>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
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
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
              
                </Box>

                <Box
                  sx={{
                    pb: 1,
                    pt: 3
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
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
                   sx={{backgroundColor:"43A047"}}
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link component={RouterLink} to="/mobile/register" variant="h6" underline="hover">
                    Register
                  </Link>
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >

                  {showPopper ? (
                    <Box sx={{
                      border: 1, p: 1, bgcolor: 'background.paper', color: 'green'
                    }}
                    >
                      {' '}

                      We have sent a Verification Link on your Email Address

                    </Box>
                  ) : null}

                </Typography>
              </form>
            )}

          </Formik>
          <Snackbar open={showSnackBar.show} autoHideDuration={6000} onClose={()=>setShowSnackBar({show:false,error:false,message:''})}>
      
      <Alert onClose={()=>setShowSnackBar({show:false,error:false,message:''})} severity={showSnackBar.error?"error":"success"} sx={{ width: '100%' }}>
      {showSnackBar.message}
      </Alert>
  
   </Snackbar>
        </Container>
      </Box>
    </>
  );
};

export default Signin;
