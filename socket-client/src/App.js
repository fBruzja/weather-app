import React from "react";
import socketIOClient from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./appStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from "@material-ui/core/Divider";

import "./App.css";

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
	{ city: "Bremen", lat: "53.073789", lng: "8.826754" }
];

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			response: false,
			anchorEl: null,
			selectedIndex: 0,
			cityData: {} 
		}

		this.handleClickListItem = this.handleClickListItem.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.connectAndSendData = this.connectAndSendData.bind(this);
	}

	componentDidMount() {
		let newCityData = JSON.parse(localStorage.getItem("city")) || { city: "Berlin", lat: "52.516667", lng: "13.4" };
		this.setState({ cityData: newCityData });
		this.connectAndSendData(false, newCityData);
	}

	connectAndSendData(flag, city) {
		if(flag) socket.disconnect();
		socket = socketIOClient(endpoint, { query: "lat=" + city.lat + "&lng=" + city.lng });
		socket.on("FromAPI", data => this.setState({ response: data }));
	}

	handleClickListItem(event) {
		this.setState({ anchorEl: event.currentTarget });
	}

	handleClose() {
		this.setState({ anchorEl: null });
	}

	handleMenuItemClick(index, option) {
		this.setState({
			selectedIndex: index,
			anchorEl: null,
			cityData: option,
			response: false
		});

		localStorage.setItem("city", JSON.stringify(option));
		this.connectAndSendData(true, option);
	}

	render() {
		const { response } = this.state;
		const { classes } = this.props;

		return (
			<div className="App" style={{ textAlign: "center" }}>
				<Card className={classes.card} elevation={5}>
					<CardHeader
						title="Your local weather."
						subheader="Updated every 10 seconds!"
						classes={{ root: classes.color }}
					/>
					<CardContent>
						<Typography variant="body2">{ response ? "The temperature in " + this.state.cityData.city + " is: " + response + "°C" : "Loading..."}</Typography>
						<Divider />
						<div className={classes.list}>
							<List component="nav" aria-label="Select Region">
								<ListItem
									button
									aria-haspopup="true"
									aria-controls="lock-menu"
									aria-label="Select a Region to know its weather:"
									onClick={this.handleClickListItem}
								>
									<ListItemText primary="Select a Region to know its weather:" />
								</ListItem>
							</List>
							<Menu
								id="lock-menu"
								anchorEl={this.state.anchorEl}
								keepMounted
								open={Boolean(this.state.anchorEl)}
								onClose={this.handleClose}
							>
								{options.map((option, index) => (
									<MenuItem
										key={option.city}
										selected={index === this.state.selectedIndex}
										onClick={() => this.handleMenuItemClick(index, option)}
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
}

App.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);
