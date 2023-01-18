const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const routes = require("./routes/v1");

//parse json request body
app.use(express.json());

//access cookies
app.use(cookieParser());

// enable cors
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/v1", routes);

module.exports = app;
