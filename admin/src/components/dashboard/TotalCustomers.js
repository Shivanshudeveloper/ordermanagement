import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { green } from '@material-ui/core/colors';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { API_SERVICE } from '../../URI';

const TotalCustomers = (props) => {
  const [customersCount, setCustomersCount] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const rawRes = await fetch(`${API_SERVICE}/api/v1/main/customer/getallcustomers`);
        const Customers = await rawRes.json();
        console.log(Customers);
        setCustomersCount(Customers.length);
      } catch (err) {
        console.log(err);
      }
    };
    getCustomers();
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TOTAL APP USERS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {customersCount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: green[600],
                height: 56,
                width: 56
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default TotalCustomers;
