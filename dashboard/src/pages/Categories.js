import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import CategoryListToolbar from "../components/Category/CategoryListToolbar";
import CategoryList from "../components/Category/CategoryList";
import { useEffect, useState } from "react";
import getUser from "../Firebase/getUser";
const Categories = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [User, setUser] = useState({ displayName: "", email: "" });
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState({ error: false, message: "" });
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    get();
  }, []);
  useEffect(() => {
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
    if (User.email !== "") get();
  }, [User]);
  const setCategoryHandler = (cat) => {
    setCategory(cat);
  };
  const handleClose = (cat) => {
    
    if (cat!==null) {
      const addCategoryFunction = async () => {
        try {
          const rawResponse = await fetch(
            "http://localhost:5000/api/v1/main/addcategory",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                category: cat.category,
                icon:cat.icon,
                email: User.email,
                restaurantName: restaurantName,
                userID: User.uid,
              }),
            }
          );
          const content = await rawResponse.json();
          setCategoryHandler("");
          
          setCategories((old) => [...old, content]);
          setError({ error: false, message: "" });
         
        } catch (err) {
          setError({ error: true, message: err.message });
     
        }
      };

  addCategoryFunction();
     
    }
    setOpen(false);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/getcategories/${User.email}`
        );
        const content = await rawResponse.json();
         console.log(content,"categopry")
        setCategories(content);

        setError({ error: false, message: "" });
      } catch (err) {
        setError({ error: true, message: err.message });
      }
    };

    getCategories();
  }, [User]);
  const handleDeleteCategory = async (id) => {
    try {
      const rawResponse = await fetch(
        `http://localhost:5000/api/v1/main/removecategory/${id}`,
        {
          method: "delete",
        }
      );
      const res = await rawResponse.json();
      console.log(res);
      const newCategories = categories.filter(
        (category) => category._id !== id
      );
      setCategories(newCategories);
      setError({ error: false, message: "" });
    } catch (err) {
      setError({ error: true, message: err.message });
    }
  };
  return (
    <>
      <Helmet>
        <title>Categories | Material Kit</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <CategoryListToolbar
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            setCategoryHandler={setCategoryHandler}
            open={open}
            User={User}
          />
          <Box sx={{ pt: 3, position: "relative", ml: "30%", width: "30%" }}>
            <CategoryList
              handleDeleteCategory={handleDeleteCategory}
              categories={categories}
              User={User}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
export default Categories;
