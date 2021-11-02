import { Helmet } from "react-helmet";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { useState,useEffect } from "react";
import getUser from "../Firebase/getUser";
const Templates = () => {
  const [layout, setLayout] = useState("Tabular Layout");
  const [dbUser,setsetdbUser]=useState(null);
   

  const [User,setUser]=useState(null);
  const setlayoutfunction=async(grid)=>{
    try{
       const rawres=await fetch(
        `http://localhost:5000/api/v1/main/user/setlayout`,    {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({grid:grid,email:User.email}),
        }
      );
      const content=await rawres.json();
      setUser(content);
      console.log(content)
    }catch(err){
      console.log(err);
    }
  }
  const handleChange = (event) => {
    let grid;
    if(event.target.value==="Grid Layout")
      grid=true;
    else
    grid=false;
    setlayoutfunction(grid);
    setLayout(event.target.value);
  };
  useEffect(() => {
    const get = async () => {
      const us=await getUser();
      setUser(us);
    };
  if(User===null)
    get();
  }, []);
  useEffect(() => {
    const get = async () => {
        try {
          const rawResponse = await fetch(
            `http://localhost:5000/api/v1/main/user/getuser/${User.email}`
          );
          const content = await rawResponse.json();
  
          setsetdbUser(content[0]);
          if(content.layout)
          setLayout("Grid Layout");
         else
        setLayout("Tabular Layout")
        } catch (err) {
          console.log(err);
        }
      };
      if(User===null)
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
          p: 30,
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{mb:5}}>
          Layouts
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={layout}
            label="Layouts"
            onChange={handleChange}
          >
            <MenuItem value={"Grid Layout"}>Grid Layout</MenuItem>
            <MenuItem value={"Tabular Layout"}>Tabular Layout</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default Templates;
