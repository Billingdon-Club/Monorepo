const path = require("path");
const {Sequelize} = require("sequelize");

const db = new Sequelize({
	dialect: "sqlite",
	storage: path.join(__dirname, "snippysnips.sqlite"),
	logging: false,
});

module.exports = db;
