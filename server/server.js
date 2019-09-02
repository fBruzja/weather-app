const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = async (socket, lat, lng) => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/3c29723f9ef37010e8a92106e0a162a8/" + lat + "," + lng + "?units=si"
        ); 
        socket.emit("FromAPI", res.data.currently.temperature);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

let interval, lat, lng;

io.on("connection", socket => {
    console.log("New client connected");
    if (interval)
        clearInterval(interval);

    let handshakeData = socket.request;
    lat = handshakeData._query['lat'];
    lng = handshakeData._query['lng'];
    console.log(lat + " " + lng)

    interval = setInterval(() => getApiAndEmit(socket, lat, lng), 10000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));