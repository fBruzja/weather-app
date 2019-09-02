# weather-app
Small but complete weather application.

A scalable application with a Node.JS server, which uses the Dark Sky API to fetch weather data and a React.JS frontend `create-react-app` built on Material-UI to show the relevant information.
All the information is transferred through socket-io.

Primarily, it is simply the temperature data refreshed every 10 seconds for the main Cities of Germany.

## Install
This project uses [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). Go check them out if you don't have them locally installed.
<br>In the root of the server and the client, run:
```
npm install
```

## Usage
One can use my Dark Sky key to test it out by keeping in mind the Dark Sky regulations. Or you could create an account and provide your own Dark Sky key for your weather data.

### Server & Client
On the root of the server and of the client, to start using it, respectively run:<br>
```
npm start
```
#### Furthermore, the server and client respectively have their own Readme-s.

## References
For creating your own account and generating your key go to [Dark Sky](https://darksky.net/dev).<br>


## Contributing

PRs accepted.

## License

MIT © Franc Bruzja
