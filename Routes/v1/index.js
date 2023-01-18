const express = require("express");

const userRoutes = require("./user.route");

const router = express.Router();

const defaultRoutes = [
	{
		path: "/user",
		route: userRoutes,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
