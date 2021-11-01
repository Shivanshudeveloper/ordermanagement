import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebase from '../../Firebase/index';

const AccountProfile = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl,setImageUrl]=useState(null);
  const [showChooseButton, setShowChooseBUtton] = useState(true);
  const [showAlert, setShowAlert] = useState({
    alert: false,
    error: false,
    message: ''
  });
  const changeHandler = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
setImageUrl(    URL.createObjectURL(e.target.files[0]));
    setShowChooseBUtton(false);
  };
  const updateUser = (ul) => {
    const auth = getAuth();
    
    updateProfile(auth.currentUser, {
      photoURL: ul
    })
      .then(() => {
        console.log('PhotoUpdated');
        navigate('/app/account', { replace: true });
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
  useEffect(() => {
    if (showAlert.alert) {
      setTimeout(() => {
        setShowAlert({ alert: false, error: false, message: '' });
      }, 1000);
    }
  }, [showAlert]);
  console.log(user);
  return (
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
            src={imageUrl?imageUrl:user.photoURL}
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
          <Button
            variant="contained"
            component="label"
            onClick={handleUpload}
            disabled={loading}
          >
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
  );
};
AccountProfile.propTypes = {
  user: PropTypes.any
};
export default AccountProfile;
