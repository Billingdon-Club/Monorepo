const {User} = require("../db");

const oAuthAuthourizationCheck = async (req, res, next) => {
	try {
		if (!req.oidc.user) throw new Error("Could not find user");
		else {
			const [user] = await User.findOrCreate({
				where: {
					username: req.oidc.user?.nickname,
					email: req.oidc.user?.email,
					name: req.oidc.user?.name,
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
	const authHeader = req.header("Authorization");
	if (!authHeader) {
		next();
	} else {
		const token = authHeader.split(" ")[1];
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		console.log(user);
		next();
	}
};

module.exports = {oAuthAuthourizationCheck, JWTAuthenticationCheck};
