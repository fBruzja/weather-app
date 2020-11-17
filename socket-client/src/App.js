import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Divider from "@material-ui/core/Divider";

import "./App.css";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
  },
  color: {
    backgroundColor: "#bdbdbd",
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

let socket = null;
const endpoint = "http://127.0.0.1:4001";

const options = [
  { city: "Berlin", lat: "52.516667", lng: "13.4" },
  { city: "Stuttgart", lat: "48.782343", lng: "9.180819" },
  { city: "Frankfurt", lat: "50.11552", lng: "9.180819" },
  { city: "Hamburg", lat: "53.575323", lng: "8.684167" },
  { city: "Essen", lat: "51.45657", lng: "7.012282" },
  { city: "Munich", lat: "48.15", lng: "11.583333" },
  { city: "Cologne", lat: "50.933333", lng: "6.95" },
  { city: "Bremen", lat: "53.073789", lng: "8.826754" },
];

export default function App() {
  const classes = useStyles();

  const [response, setResponse] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cityData, setCityData] = useState({});

  useEffect(() => {
    let newCityData = JSON.parse(localStorage.getItem("city")) || {
      city: "Berlin",
      lat: "52.516667",
      lng: "13.4",
    };
    setCityData(newCityData);
    connectAndSendData(false, newCityData);
  }, []);

  const connectAndSendData = (flag, city) => {
    if (flag) socket.disconnect();
    socket = socketIOClient(endpoint, {
      query: "lat=" + city.lat + "&lng=" + city.lng,
    });
    socket.on("FromAPI", (data) => setResponse(data));
  };

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index, option) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setCityData(option);
    setResponse(false);

    localStorage.setItem("city", JSON.stringify(option));
    connectAndSendData(true, option);
  };

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <Card className={classes.card} elevation={5}>
        <CardHeader
          title="Your local weather."
          subheader="Updated every 10 seconds!"
          classes={{ root: classes.color }}
        />
        <CardContent>
          <Typography variant="body2">
            {response
              ? "The temperature in " +
                cityData.city +
                " is: " +
                response +
                "°C"
              : "Loading..."}
          </Typography>
          <Divider />
          <div className={classes.list}>
            <List component="nav" aria-label="Select Region">
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label="Select a Region to know its weather:"
                onClick={handleClickListItem}
              >
                <ListItemText primary="Select a Region to know its weather:" />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option.city}
                  selected={index === selectedIndex}
                  onClick={() => handleMenuItemClick(index, option)}
                >
                  {option.city}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
