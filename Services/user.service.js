const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const sendEmail = require("../utils/email/sendEmail");


const addUser = async (data) => {
	const hash = await bcrypt.hash(data.password, 10);
	data.password = hash;
	const user = await User.create(data);
	return user;
};

const findUserByEmail = async (email) => {
	const user = await User.findOne({ email });
	return user;
};

const findUserById = async (id) => {
	const user = await User.findById(id);
	return user;
};

const generateToken = async (userId) => {
	const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
	await User.updateOne({ _id: userId }, { $set: { token: token } });
	return token;
};

const changePassword = async (userId, password) => {
	const hash = await bcrypt.hash(password, 10);
	const user = await User.findByIdAndUpdate(userId, { password: hash });
	return user;
};

const updateResetToken = async (email, resetToken, resetTokenExpiry) => {
	const user = await User.updateOne(
		{ email },
		{ $set: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry } }
	);
	console.log(user);
	return user;
};

const sendResetEmail = async (name , email, resetToken) => {
	sendEmail(
		email,
		"Password Reset Request",
		{
			name: name,
			link: process.env.clientUrl + "/reset-password/" + resetToken  // Todo >> add link later ????
		},
		"./template/requestResetPassword.handlebars"
	);
};

const sendPasswordChangedEmail = async (name , email) => {
	sendEmail(
		email,
		"Password Reset Successfully",
		{
			name: name,
		},
		"./template/resetPassword.handlebars"
	);};

const findUserByResetToken = async (token) => {
	const user = await User.findOne({ resetToken: token });
	return user;
};

const resetPassword = async (email, password) => {
	const hash = await bcrypt.hash(password, 10);
	await User.updateOne(
		{ email: email },
		{ $set: { password: hash }, $unset: { resetToken: 1, resetTokenExpiry: 1 } }
	);
};

module.exports = {
	addUser,
	findUserByEmail,
	findUserById,
	generateToken,
	changePassword,
	updateResetToken,
	sendResetEmail,
	findUserByResetToken,
	resetPassword,
	sendPasswordChangedEmail,
};
