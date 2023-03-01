const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
	language: {
		type: String,
		required: false,
	},
	content: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		required: false,
	},
	owner: {type: mongoose.Types.ObjectId, ref: "User"},
});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
