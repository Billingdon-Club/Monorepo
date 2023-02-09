require("dotenv").config();
const express = require("express");
const app = express();
const {auth, requiresAuth} = require("express-openid-connect");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const {
	oAuthAuthourizationCheck,
	JWTAuthenticationCheck,
} = require("../middleware");
const {User} = require("../db");
const path = require("path");

const PORT = process.env.PORT || 5002;

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.BASEURL,
	clientID: process.env.CLIENTID,
	issuerBaseURL: process.env.ISSUERBASEURL,
};

app.use(cors());
app.use(express.json());

app.use(auth(config));

app.use(oAuthAuthourizationCheck);
app.use(JWTAuthenticationCheck);

app.get("/", async (req, res, next) => {
	if (req.oidc.isAuthenticated()) {
		try {
			const token = jwt.sign(req.oidc.user, process.env.JWT_SECRET, {
				expiresIn: "1w",
			});
			res.redirect(`${process.env.FRONT_END_URL}/mysnippets/?t=${token}`);
		} catch (error) {
			console.log(error);
			next(error);
		}
	} else {
		res.send("Logged out");
	}
});

app.get("/logout-direct", (req, res) => {
	res.redirect(
		`${process.env.ISSUERBASEURL}/v2/logout?client_id=${process.env.CLIENTID}&returnTo=http://localhost:3000/`
	);
});

app.get("/register", (req, res, next) => {
	res.oidc.login({
		authorizationParams: {
			screen_hint: "signup",
		},
	});
});

app.get("/isAuthenticated", (req, res, next) => {
	res.json(req.user ? {isAuthenticated: true} : {isAuthenticated: false});
});

app.get("/me", requiresAuth(), async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {username: req.oidc.user?.nickname},
			raw: true,
		});
		const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1w"});
		res.json({token: token});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

app.use((error, req, res, next) => {
	console.error("SERVER ERROR: ", error);
	if (res.statusCode < 400) res.status(500);
	res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
	console.log(`Snippets are ready at port: ${PORT}`);
});
