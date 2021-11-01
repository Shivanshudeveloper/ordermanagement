import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import MenuListToolbar from "../components/Menu/MenuListToolbar";
import { useState, useEffect } from "react";
import MenuList from "../components/Menu/MenuList";
import getUser from "../Firebase/getUser";
const Menu = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [User, setUser] = useState(null);
  const [error, setError] = useState({ error: false, message: "" });
  const [restaurantName, setRestaurantName] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const setMenuListHandler = (men) => {
    console.log(men);
    setMenu(men);
  };
  useEffect(() => {
    const get = async () => {
      const us=await getUser();
      setUser(us);
    };

    get();
  }, []);
  const handleClose = (men) => {
    setOpen(false);
    if (men !== null) {
      console.log(men);
      const addMenuFunction = async () => {
        try {
          const rawResponse = await fetch(
            "http://localhost:5000/api/v1/main/menu/addmenu",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(men),
            }
          );
          const content = await rawResponse.json();
          console.log(content);
          setMenuList((old) => [...old, content]);
          setError({ error: false, message: "" });
          setMenuListHandler(null);
        } catch (err) {
          setError({ error: true, message: err.message });
        }
      };
      addMenuFunction();
    }
  };
  useEffect(() => {
    const getmenu = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/menu/getmenu/${User.email}`
        );
        const content = await rawResponse.json();

        setMenuList(content);
        setError({ error: false, message: "" });
      } catch (err) {
        setError({ error: true, message: err.message });
      }
    };
    getmenu();
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setRestaurantName(content[0].restaurantName);
      } catch (err) {
        console.log(err);
      }
    };

    get();
  }, [User]);
  return (
    <>
      <Helmet>
        <title>Menu | Material Kit</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <MenuListToolbar
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            setMenuListHandler={setMenuListHandler}
            open={open}
            menuList={menuList}
            User={User}
            restaurantName={restaurantName}
          />
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <MenuList
                menuList={menuList}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Menu;
