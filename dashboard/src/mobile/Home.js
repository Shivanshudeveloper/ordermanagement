import React from "react";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Header from "./components/Header";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";

import List from "./components/List";
import getUser from "../Firebase/getUser";
import { useEffect, useState } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: "10px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  const classes = useStyles();
  const [User, setUser] = useState(null);
  const [dbUser, setdbUser] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    if (User === null) get();
  }, []);
  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setdbUser(content[0]);
        console.log(content);
      } catch (err) {
        console.log(err);
      }
    };

    get();
  }, [User]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cheese Burger</DialogTitle>
        <DialogContent>
          <section>
            <center>
              <img
                alt=""
                style={{ width: "100%", borderRadius: "10px" }}
                src="https://wallpapercave.com/wp/wp1987065.jpg"
              />
            </center>

            <h4 style={{ marginTop: "10px", color: "green" }}>RM 10.00</h4>

            <p style={{ marginTop: "10px" }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <List />
          </section>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      <Header />

      <Container style={{ marginTop: "10px" }}>
        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search Menu Items"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton
            type="button"
            className={classes.iconButton}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>
          Restaurent Items
        </h4>
        <Grid container spacing={3}>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper onClick={handleClickOpen} className={classes.paper}>
              <center>
                <img
                  alt=""
                  src="https://img.icons8.com/color/48/000000/hamburger.png"
                />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img
                  alt=""
                  src="https://img.icons8.com/color/48/000000/hamburger.png"
                />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img
                  alt=""
                  src="https://img.icons8.com/color/48/000000/hamburger.png"
                />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img
                  alt=""
                  src="https://img.icons8.com/color/48/000000/hamburger.png"
                />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img
                  alt=""
                  src="https://img.icons8.com/color/48/000000/hamburger.png"
                />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img src="https://img.icons8.com/color/48/000000/hamburger.png" />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img src="https://img.icons8.com/color/48/000000/hamburger.png" />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
          <Grid item xs={dbUser === null ? 6 : dbUser.layout ? 6 : 12}>
            <Paper className={classes.paper}>
              <center>
                <img src="https://img.icons8.com/color/48/000000/hamburger.png" />
              </center>
              <h4 style={{ marginTop: "10px" }}>Cheese Burger</h4>
              <small style={{ marginTop: "6px" }}>Double Veg</small>
              <h5 style={{ color: "red" }}>RM 12.58</h5>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
