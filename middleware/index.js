const {User} = require("../db");
const jwt = require("jsonwebtoken");

const oAuthAuthourizationCheck = async (req, res, next) => {
	try {
		if (!req.oidc.user) throw new Error("Could not find user");
		else {
			const [user] = await User.findOrCreate({
				where: {
					username: req.oidc.user?.nickname,
					email: req.oidc.user?.email,
					name: req.oidc.user?.name,
					profilePic: req.oidc.user?.picture,
					role: "user",
				},
			});
			console.log(user);
			next();
		}
	} catch (error) {
		console.log(error);
		next();
	}
};

const JWTAuthenticationCheck = async (req, res, next) => {
	try {
		console.log("authHeader");
		const authHeader = req.header("Authorization");
		console.log(authHeader);
		if (!authHeader) {
			next();
		} else {
			const token = authHeader.split(" ")[1];
			const retrievedData = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({
				where: {username: retrievedData.username},
				raw: true,
			});
			req.user = user;
			console.log(retrievedData, user);
			next();
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};

module.exports = {oAuthAuthourizationCheck, JWTAuthenticationCheck};
