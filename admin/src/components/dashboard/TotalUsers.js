import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import { useState, useEffect } from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { API_SERVICE } from '../../URI';

const TotalUsers = (props) => {
  const [usersCount, setUsersCount] = useState(0);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const rawRes = await fetch(`${API_SERVICE}/api/v1/main/user/getallusers`);
        const u = await rawRes.json();

        setUsersCount(u.length);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
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
              TOTAL USERS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {usersCount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: indigo[600],
                height: 56,
                width: 56
              }}
            >
              <PeopleAltIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default TotalUsers;
