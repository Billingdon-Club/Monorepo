const {User} = require("../db");
const jwt = require("jsonwebtoken");

const oAuthAuthourizationCheck = async (req, res, next) => {
	try {
		if (!req.oidc.user) throw new Error("Could not find user");
		else {
			const foundUser = await User.findOne({
				username: req.oidc.user?.nickname,
				email: req.oidc.user?.email,
				name: req.oidc.user?.name,
				profilePic: req.oidc.user?.picture,
				role: "user",
			});

			if (!foundUser)
				await User.create({
					username: req.oidc.user?.nickname,
					email: req.oidc.user?.email,
					name: req.oidc.user?.name,
					profilePic: req.oidc.user?.picture,
					role: "user",
				});
			// const [user] = await User.findOrCreate(
			// 	{
			// 		username: req.oidc.user?.nickname,
			// 		email: req.oidc.user?.email,
			// 		name: req.oidc.user?.name,
			// 		profilePic: req.oidc.user?.picture,
			// 		role: "user",
			// 	},
			// 	function (err, newElement, created) {
			// 		if (err) console.log(err);
			// 	}
			// );
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
				username: retrievedData.username,
			}).exec();
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
