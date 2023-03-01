require("dotenv").config();
const mongoose = require("mongoose");
const {ServerApiVersion} = require("mongodb");

const connection = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			serverApi: ServerApiVersion.v1,
		});
		console.log("connected");
	} catch (error) {
		console.log(error);
	}
};

connection();

module.exports = connection;
