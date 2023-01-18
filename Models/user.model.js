const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	mobile: {
		type: String,
		required: true,
		trim: true,
		index: true,
	},
	token: {
		type: String,
	},
	resetToken: {
		type: String,
	},
	resetTokenExpiry: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("User", userSchema);
