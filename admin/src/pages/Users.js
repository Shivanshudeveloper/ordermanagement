import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button, Snackbar
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { API_SERVICE } from '../URI';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [csvData, setcsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '' });
  useEffect(() => {
    const getUsers = async () => {
      try {
        const rawRes = await fetch(
          `${API_SERVICE}/api/v1/main/user/getallusers`
        );
        const u = await rawRes.json();
        console.log(u);
        setUsers(u);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);
  useEffect(() => {
    const dat = [];
    setLoading(true);
    for (let i = 0; i < users.length; i++) {
      dat.push({
        'User Name': `${users[i].username}`,
        Email: users[i].email,
        'Restaurant Name': users[i].restaurantName,
        'Registration date': new Date(users[i].date).toDateString()
      });
    }
    setcsvData(dat);
    setLoading(false);
  }, [users]);
  const blockUserHandler = async (user) => {
    /* eslint-disable */
    let u = [...users];

    try {
      const rawres = await fetch(
        `${API_SERVICE}/api/v1/main/user/changeuseraccess`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            access: false
          })
        }
      );
      const content = await rawres.json();
      const i = u.findIndex((ele) => ele.email === user.email);
      u[i].access = false;
      setUsers(u);
      setNotify({ open: true, message: 'User Successfully Blocked' });
    } catch (err) {
      console.log(err);
    }
    /* eslint-enable */
  };
  const unblockUserHandler = async (user) => {
    /* eslint-disable */
        let u = [...users];

    try {
      const rawres = await fetch(
        `${API_SERVICE}/api/v1/main/user/changeuseraccess`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            access: true
          })
        }
      );
      const content = await rawres.json();
      const i = u.findIndex((ele) => ele.email === user.email);
      u[i].access = true;
      setUsers(u);
      setNotify({ open: true, message: 'User unblocked' });
    } catch (err) {
      console.log(err);
    }
    /* eslint-enable */
  };
  const handleClose = () => {
    setNotify({ open: false, message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Users | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',

          py: 3
        }}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
          maxWidth={false}
        >
          {!loading ? (
            <Box sx={{ placeSelf: 'end', mb: 2 }}>
              <CSVLink data={csvData}>
                {' '}
                <Button
                  sx={{
                    backgroundColor: 'rgb(34,139,34)',
                    fontWeight: 800,
                    fontSize: '1.01em'
                  }}
                  variant="contained"
                >
                  Download CSV
                </Button>
              </CSVLink>
            </Box>
          ) : null}
          <Box sx={{ pt: 3, backgroundColor: 'white' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Restaurant Name</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Access</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {user.username}
                        <Typography color="textPrimary" variant="body1" />
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.restaurantName}</TableCell>

                    <TableCell>
                      {moment(user.date).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>{user.access ? 'true' : 'false'}</TableCell>
                    <TableCell>
                      {user.access ? (
                        <Button variant="contained" onClick={() => blockUserHandler(user)}>
                          BLOCK USER
                        </Button>
                      ) : (
                        <Button variant="contained" onClick={() => unblockUserHandler(user)}>
                          UN BLOCK
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={notify.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={notify.message}
      />
    </>
  );
};

export default Users;
