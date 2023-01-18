const catchAsync = require("../utils/catchAsync");
const userService = require("../Services/user.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const addUser = async (req, res) => {
	const body = req.body;

	var user = await userService.findUserByEmail(body.email);

	if (user) {
		return res.status(409).json({
			msg: "Email already exist",
		});
	}

	user = await userService.addUser(body);
	return res.status(201).send(user);
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await userService.findUserByEmail(email);

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ error: "Email or password is incorrect" });
	}

	// Generate a JSON Web Token
	const token = await userService.generateToken(user._id);

	// Store the token in a cookie
	res.cookie("access_token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + 86400000),
	});

	res.json({ message: "Login successful", token });
};

const logout = async (req, res) => {
	res.clearCookie("access_token");
	res.json({ message: "Logout successful" });
};

const changePassword = async (req, res) => {
	//Validate user inputs
	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	// Find the user in the database
	const user = await userService.findUserById(req.userId);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	// Compare the current password with the hashed password in the database
	var isMatch = await bcrypt.compare(currentPassword, user.password);

	if (!isMatch) {
		return res.status(401).json({ message: "Incorrect password" });
	}

	// Update the user's password in the database
	const updatedUser = await userService.changePassword(req.userId, newPassword);

	if (!updatedUser) {
		return res.status(400).json({ message: "Error in updating password" });
	}

	res.status(200).json({ message: "Password changed successfully" });
};

const forgotPassord = async (req, res) => {
	const { email } = req.body;

	// Find the user by their email
	const user = await userService.findUserByEmail(email);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	// Generate a reset token and expiration date
	const resetToken = crypto.randomBytes(32).toString("hex");
	const resetTokenExpiry = Date.now() + 3600000; // 1 hour

	// Save the reset token and expiry date to the user's document
	const result = await userService.updateResetToken(
		email,
		resetToken,
		resetTokenExpiry
	);

	// Send the reset email
	userService.sendResetEmail(user.name, email, resetToken);

	res.json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	// Find the user by the reset token
	const user = await userService.findUserByResetToken(token);

	// If the token is invalid or has expired, return an error
	if (!user || Date.now() > user.resetTokenExpiry) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}

	// Save the new password and remove the reset token
	await userService.resetPassword(user.email, password);

	// Send a password reset confirmation email
	userService.sendPasswordChangedEmail(user.name , user.email);

	res.json({ message: "Password reset successfully" });
};

module.exports = {
	addUser: catchAsync(addUser),
	login: catchAsync(login),
	logout: catchAsync(logout),
	changePassword: catchAsync(changePassword),
	forgotPassord: catchAsync(forgotPassord),
	resetPassword: catchAsync(resetPassword),
};
