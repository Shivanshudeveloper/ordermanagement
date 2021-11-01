import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Container,
  TextField,
  DialogContentText,
  DialogActions,
  DialogContent,
  Dialog, Alert, AlertTitle
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  getAuth, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router';

const AccountProfileDetails = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const [changePassword, setChangePassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState({ dialog: false, isCancel: false });
  const [oldPassword, setOldPassword] = useState('');
  const [oldEmail, setoldEmail] = useState('');
  const [val, setVal] = useState({ values: null, setSubmitting: null });
  const [notify, setNotify] = useState({ success: false, message: '' });

  const saveProfile = () => {
    const { values, setSubmitting } = val;
    if (showDialog.isCancel === true) { setSubmitting(false); return; }
    const {
      firstName, lastName, email, password
    } = values;
    const auth = getAuth();
    if (`${firstName} ${lastName}` !== user.displayName) {
      updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`
      }).then(() => {
        setSubmitting(false);
        setNotify({ success: true, message: 'Profile updated' });
      })
        .catch((error) => { setNotify({ success: false, message: error.message.replace('Firebase', '') }); });
    }
    if (email !== user.email) {
      const credential = EmailAuthProvider.credential(
        oldEmail, oldPassword
      );

      reauthenticateWithCredential(user, credential).then(() => {
        updateEmail(auth.currentUser, email).then(() => {
          setNotify({ success: true, message: 'Email updated' });
          setSubmitting(false);
          navigate('/login', { replace: true });
        }).catch((error) => {
          console.log(error);
          setNotify({ success: false, message: error.message.replace('Firebase:', '') });
        });
      }).catch((error) => {
        setNotify({ success: false, message: error.message.replace('Firebase:', '') });
      });
    }

    if (password !== '') {
      const credential = EmailAuthProvider.credential(
        oldEmail, oldPassword
      );

      reauthenticateWithCredential(user, credential).then(() => {
        updatePassword(auth.currentUser, password).then(() => {
          setNotify({ success: true, message: 'Password Changed' });
          setChangePassword(false);
          setSubmitting(false);
        }).catch((error) => {
          setNotify({ success: false, message: error.message.replace('Firebase:', '') });
        });
      }).catch((error) => {
        setNotify({ success: false, message: error.message.replace('Firebase:', '') });
      });
    }
    setSubmitting(false);
  };
  const handleClickOpen = (values, { setSubmitting }) => {
    setVal({ values, setSubmitting });
    setShowDialog({ dialog: true, isCancel: false });
  };
  const handleClose = () => {
    setShowDialog({ dialog: false, isCancel: false });
    saveProfile();
  };
  useEffect(() => {
    if (notify.message !== '') {
      setTimeout(() => {
        setNotify({ success: false, message: '' });
      }, 7000);
    }
  }, [notify]);
  return (
    <>
      <Container maxWidth="sm">
        <Formik
          initialValues={{
            firstName: (user.displayName).split(' ')[0],
            lastName: (user.displayName).split(' ')[1],
            email: user.email,
            password: ''
          }}
          enableReinitialize
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Must be a valid email')
              .max(255)
              .required('Email is required'),
            firstName: Yup.string()
              .max(255)
              .required('First name is required'),
            lastName: Yup.string().max(255).required('Last name is required')
          })}
          onSubmit={
            handleClickOpen
}
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
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              {...props}
            >
              <Card>
                <CardHeader
                  subheader="The information can be edited"
                  title="Profile"
                />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.firstName && errors.firstName)}
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
                        label=""
                        name="firstName"
                        onChange={handleChange}
                        required
                        value={values.firstName}
                        variant="outlined"
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.lastName && errors.lastName)}
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
                        label=""
                        name="lastName"
                        onChange={handleChange}
                        required
                        value={values.lastName}
                        variant="outlined"
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label=""
                        name="email"
                        disabled={true}
                        onChange={handleChange}
                        required
                        value={values.email}
                        variant="outlined"
                        onBlur={handleBlur}
                      />
                    </Grid>

                    {changePassword ? (
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >

                        <Button
                          color="primary"
                          fullWidth
                          variant="text"
                          onClick={() => setChangePassword(false)}
                        >
                          change Password
                        </Button>
                      </Grid>
                    )
                      : (
                        <Grid
                          item
                          md={6}
                          xs={12}
                        >
                          <TextField
                            error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            label=""
                            name="password"
                            onChange={handleChange}
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            variant="outlined"
                            onBlur={handleBlur}
                          />
                          {!showPassword ? (
                            <Button
                              color="secondary"
                              fullWidth
                              variant="text"
                              onClick={() => setShowPassword(true)}
                            >
                              show Password
                            </Button>
                          ) : (
                            <Button
                              color="secondary"
                              fullWidth
                              variant="text"
                              onClick={() => setShowPassword(false)}
                            >
                              Don&apos;t show Password
                            </Button>
                          )}
                        </Grid>
                      )}

                    <Grid
                      item
                      md={6}
                      xs={12}
                    />
                  </Grid>
                </CardContent>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save details
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
        <Dialog fullWidth open={showDialog.dialog} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>
              Enter your Email
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label=""
              type="email"
              fullWidth
              variant="standard"
              value={oldEmail}
              onChange={(e) => setoldEmail(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <DialogContentText>
              Enter your Password
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label=""
              type="password"
              fullWidth
              variant="standard"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => { val.setSubmitting(false); setShowDialog({ dialog: false, isCancel: true }); }}>Cancel</Button>
            <Button onClick={handleClose}>Done</Button>
          </DialogActions>
        </Dialog>

      </Container>
      {notify.success ? (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {notify.message}
          {' '}

        </Alert>
      ) : null}
      {' '}
      {(notify.message !== '' && !notify.success) ? (
        <Alert severity="warning">
          <AlertTitle>Failed</AlertTitle>
          {notify.message}
        </Alert>
      ) : null}
    </>
  );
};
AccountProfileDetails.propTypes = {
  user: PropTypes.any.isRequired,
};
export default AccountProfileDetails;
