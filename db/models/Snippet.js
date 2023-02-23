const db = require("../db");
const {Sequelize, Model, DataTypes} = require("sequelize");

class Snippet extends Model {}

Snippet.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: db,
	}
);

module.exports = Snippet;
