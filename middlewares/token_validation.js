const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.sendStatus(403);
	}
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = data.userId;
		console.log("uid==> " , data.userId)
		return next();
	} catch {
		return res.sendStatus(403);
	}
};

module.exports = authorization;
