import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import MenuListToolbar from "../components/Menu/MenuListToolbar";
import { useState, useEffect } from "react";
import MenuList from "../components/Menu/MenuList";
import getUser from "../Firebase/getUser";
import { API_SERVICE } from '../URI';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [filteredMenuList,setFilteredMenuList]=useState([]);
  const [User, setUser] = useState(null);
  const [error, setError] = useState({ error: false, message: "" });
  const [restaurantName, setRestaurantName] = useState("");
  const [searchText,setSearchText]=useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const setMenuListHandler = (men) => {
    console.log(men);
    setMenu(men);
  };
  useEffect(() => {
    const get = async () => {
      const us = await getUser();
      setUser(us);
    };
    if (User === null) get();
  }, []);
  const handleClose = (men) => {
    setOpen(false);
   
    if (men !== null) {
      console.log(men);
      const addMenuFunction = async () => {
        try {
          const rawResponse = await fetch(
            `${API_SERVICE}/api/v1/main/menu/addmenu`,
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
  const updateMenu=(menu)=>{
    const MenuList=menuList;
    const index=MenuList.findIndex((m=>m._id===menu._id));
    MenuList[index]=menu;
    const FilteredMenuList=filteredMenuList;
    const indexfiltered=filteredMenuList.findIndex((m=>m._id===menu._id));
    FilteredMenuList[indexfiltered]=menu;
    
    const updateMenuList = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/menu/updatemenu/${menu._id}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(menu),
          }
        );
        const content = await rawResponse.json();
        console.log(content);
     
        setError({ error: false, message: "" });
        setMenuListHandler(null);
        setMenuList(MenuList);
        setFilteredMenuList(FilteredMenuList);
      } catch (err) {
        setError({ error: true, message: err.message });
      }
    };
    updateMenuList();
  }
  useEffect(() => {
    const getmenu = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/menu/getmenu/${User.email}`
        );
        const content = await rawResponse.json();
        console.log(content);
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
          `${API_SERVICE}/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setRestaurantName(content[0].restaurantName);
      } catch (err) {
        console.log(err);
      }
    };

    get();
  }, [User]);
  const handleDeleteMenu = async (id) => {
    const newMenu = menuList.filter(
      (m) => m._id !== id
    );
    const newFilteredList=filteredMenuList.filter((m)=>m._id!==id);

    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/menu/removemenu/${id}`,
        {
          method: "delete",
        }
      );
      const res = await rawResponse.json();
      console.log(res);

      setMenuList(newMenu);
      setFilteredMenuList(newFilteredList);
      setError({ error: false, message: "" });
    } catch (err) {
      setError({ error: true, message: err.message });
    }
  };
  const searchHandler=(value)=>{
    let filteredCurrent=menuList.filter((obj)=>obj.item.toLowerCase().includes(value.toLowerCase()));
    console.log(filteredCurrent);
    setSearchText(value);
    setFilteredMenuList(filteredCurrent);
  }
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
            searchHandler={searchHandler}
          />
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <MenuList menuList={menuList} filteredMenuList={filteredMenuList} updateMenu={updateMenu} searchText={searchText}     User={User} handleDeleteMenu={handleDeleteMenu}/>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Menu;
