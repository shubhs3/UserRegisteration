const mongoose = require("mongoose");
const app = require("./app");

require('dotenv').config();

let server;

mongoose.set('strictQuery', true);
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		server = app.listen(process.env.APP_PORT, () => {
			console.log(`Listening to port ${process.env.APP_PORT}`);
		});
	});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			console.log("Server Closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	console.log(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	console.log("SIGTERM received")
	if (server) {
		server.close();
	}
});
