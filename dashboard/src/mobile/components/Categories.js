import { Box, Container, Typography, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { API_SERVICE } from "../../URI";

const viewAllIcon = `${process.env.PUBLIC_URL}/static/images/categoryIcons/all.png`;
const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      boxShadow: "none",
      background: "#eef1f5",
    },
    "&:active": {
      boxShadow: "none",
      background: "#eef1f5",
    },
  },
}));
const Categories = ({ User, changeCategoryHandler }) => {
  const classes = useStyles();
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/getcategories/${User.email}`
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
      sx={{ height: 130, mt: 1, backgroundColor: "white", overflowY: "hidden",overflowX:"scroll" }}
    >
      <Typography
        sx={{ pt: 0, color: "#6f86d6", fontWeight: 800 }}
        color="textPrimary"
        variant="h5"
      >
        Explore Categories
      </Typography>
      <Box
        sx={{ display: "flex", overflowX:"scroll", m: 0 }}
      >
        <Box sx={{ ml: 1, mt: 0, display: "flex", flexDirection: "column" }}>
          <Button
            className={classes.button}
            onClick={() => changeCategoryHandler("viewAll")}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {" "}
            <img alt="" src={viewAllIcon} width="70px" height="70px" />
            <Typography
              sx={{ pt: 1, color: "#6f86d6", fontWeight: 800 }}
              color="textPrimary"
              variant="h6"
            >
              View All
            </Typography>
          </Button>
        </Box>
        {categories?.map((cat) => {
          return (
            <Box
              key={cat._id}
              sx={{ ml: 1, mt: 0, display: "flex", flexDirection: "column" }}
            >
              <Button
                className={classes.button}
                onClick={() => changeCategoryHandler(cat.category)}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                {" "}
                <img alt="" src={cat.icon} width="70px" height="70px" />
                <Typography
                  sx={{ pt: 1, color: "#6f86d6", fontWeight: 800 }}
                  color="textPrimary"
                  variant="h6"
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
