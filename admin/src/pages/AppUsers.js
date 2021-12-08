import { Helmet } from 'react-helmet';
import {
  Box, Container, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { API_SERVICE } from '../URI';

const AppUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [csvData, setcsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const rawRes = await fetch(`${API_SERVICE}/api/v1/main/customer/getallcustomers`);
        const Customers = await rawRes.json();
        console.log(Customers);
        setCustomers(Customers);
      } catch (err) {
        console.log(err);
      }
    };
    getCustomers();
  }, []);
  useEffect(() => {
    const dat = [];
    setLoading(true);
    for (let i = 0; i < customers.length; i++) {
      dat.push({ Name: `${customers[i].firstName} ${customers[i].firstName}`, Email: customers[i].email, 'Registration date': new Date(customers[i].createdAt).toDateString() });
    }
    setcsvData(dat);
    setLoading(false);
  }, [customers]);
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
            flexDirection: 'column',
          }}
          maxWidth={false}
        >
          {!loading ? (

            <Box sx={{ placeSelf: 'end', mb: 2 }}>
              <CSVLink data={csvData}>
                {' '}
                <Button sx={{ backgroundColor: 'rgb(34,139,34)', fontWeight: 800, fontSize: '1.01em' }} variant="contained">Download CSV      </Button>
              </CSVLink>
            </Box>

          ) : null}
          <Box sx={{ pt: 3, backgroundColor: 'white' }}>
            <Table>
              <TableHead>
                <TableRow>

                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Email
                  </TableCell>

                  <TableCell>
                    Registration date
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    hover
                    key={customer.id}
                  >

                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {customer.firstName}
                          {' '}
                          {customer.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer.email}
                    </TableCell>
                    <TableCell>
                      {moment(customer.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AppUsers;
