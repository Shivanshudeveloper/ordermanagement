import { Box, Container, Typography, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles((theme) => ({
        button:{
                "&:hover": {
                        boxShadow: "none",
                        background: "#eef1f5"
                     },
                     "&:active": {
                        boxShadow: "none",
                        background: "#eef1f5"
                     }
        }
      }));
const Categories = ({ User, changeCategoryHandler }) => {
        const classes = useStyles();
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const rawResponse = await fetch(
          `http://localhost:5000/api/v1/main/getcategories/${User.email}`
        );
        const content = await rawResponse.json();
        console.log(content, "categopry");
        setCategories(content);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  }, [User]);
  return (
    <Container
      sx={{ height: 200, mt: 1, backgroundColor: "white", overflow: "scroll" }}
    >
      <Typography
        sx={{ pt: 1, color: "#6f86d6", fontWeight: 800 }}
        color="textPrimary"
        variant="h5"
      >
        Explore Categories
      </Typography>
      <Box sx={{ display: "flex", overflow: "scroll", m: 0 }}>
        {categories?.map((cat) => {
          return (
            <Box
              key={cat._id}
              sx={{ ml: 3, mt: 2, display: "flex", flexDirection: "column" }}
            >
              <Button  className={classes.button} onClick={() => changeCategoryHandler(cat.category)}       sx={{display: "flex", flexDirection: "column" }} > 
                {" "}
                <img alt="" src={cat.icon} width="100px" height="100px" />
      
                <Typography
                  sx={{ pt: 1, color: "#6f86d6", fontWeight: 800 }}
                  color="textPrimary"
                  variant="h5"
                >
                  {cat.category}
                </Typography>
                     
              </Button>
             
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default Categories;
