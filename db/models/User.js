const db = require("../db");
const {Sequelize, Model, DataTypes} = require("sequelize");

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		profilePic: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.ENUM("admin", "user"),
			allowNull: true,
		},
	},
	{
		sequelize: db,
	}
);

module.exports = User;
