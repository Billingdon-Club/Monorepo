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
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "No Description",
		},
		tags: {
			type: DataTypes.ARRAY,
			allowNull: true,
			defaultValue: ["code"],
		},
	},
	{
		sequelize: db,
	}
);

module.exports = Snippet;
