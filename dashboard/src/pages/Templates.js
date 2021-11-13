import { Helmet } from "react-helmet";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Button,

} from "@material-ui/core";

import { useState, useEffect } from "react";
import getUser from "../Firebase/getUser";
import { API_SERVICE } from '../URI';

const Templates = () => {
  const [layout, setLayout] = useState("Tabular Layout");
  const [dbUser, setsetdbUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [User, setUser] = useState(null);
  const setlayoutfunction = async (grid) => {
    try {
      const rawres = await fetch(
        `${API_SERVICE}/api/v1/main/user/setlayout`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grid: grid, email: User.email }),
        }
      );
      const content = await rawres.json();
      setUser(content);
      setLoading(false);
      console.log(content);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const handleChange = (event) => {
    setLayout(event.target.value);
  };
  useEffect(() => {
    const get = async () => {
      const us = await getUser();
      setUser(us);
    };
    if (User === null) get();
  }, []);
  const onSubmit = () => {
    let grid;
    setLoading(true);
    if (layout === "Grid Layout") grid = true;
    else grid = false;
    console.log(grid);
    setlayoutfunction(grid);
  };
  useEffect(() => {
    const get = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/user/getuser/${User.email}`
        );
        const content = await rawResponse.json();

        setsetdbUser(content[0]);
        if (content[0].layout) setLayout("Grid Layout");
        else setLayout("Tabular Layout");
      } catch (err) {
        console.log(err);
      }
    };
    get();
  }, [User]);
  return (
    <>
      <Helmet>
        <title>Templates</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          mr: 50,
          ml: 50,
          mt: 0,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
          Layouts
        </Typography>

        <FormControl
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "50px",
          }}
        >
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            sx={{ width: "80%" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={layout}
            label="Layouts"
            onChange={handleChange}
          >
            <MenuItem value={"Grid Layout"}>Grid Layout</MenuItem>
            <MenuItem value={"Tabular Layout"}>Tabular Layout</MenuItem>
          </Select>
          <Button variant="contained" onClick={onSubmit} disabled={loading}>
            {loading && <CircularProgress size={14} />}
            {!loading && "Submit"}
          </Button>
        </FormControl>

        {layout === "Tabular Layout" ? (
          <img
            width="40%"
            heihgt="40%"
            style={{
              marginLeft: "20%",
              boxShadow: "1px 1px 30px 1px lightgrey",
            }}
            src={`${process.env.PUBLIC_URL}/static/images/layouts/Tabular.png`}
            alt=""
          />
        ) : (
          <img
            width="40%"
            heihgt="40%"
            style={{
              marginLeft: "20%",
              boxShadow: "1px 1px 30px 1px lightgrey",
            }}
            src={`${process.env.PUBLIC_URL}/static/images/layouts/grid.png`}
            alt=""
          />
        )}
      </Box>
    </>
  );
};

export default Templates;
