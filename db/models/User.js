const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
	},
	username: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
	},

	profilePic: {
		type: String,
		required: false,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		required: true,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
