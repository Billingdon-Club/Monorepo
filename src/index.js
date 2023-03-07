require("dotenv").config();
const express = require("express");
const app = express();
const {auth, requiresAuth, claimEquals} = require("express-openid-connect");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const {
	oAuthAuthourizationCheck,
	JWTAuthenticationCheck,
} = require("../middleware");
const {User} = require("../db");
const connection = require("../db/db");
const snippets = require("../routes/snippets");

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

app.use("/snippets", snippets);

app.get("/", async (req, res, next) => {
	if (req.oidc.isAuthenticated()) {
		try {
			const user = await User.findOne({
				username: req.oidc.user?.nickname,
			});
			const token = jwt.sign(
				{username: req.oidc.user?.nickname},
				process.env.JWT_SECRET
			);
			res.redirect(`${process.env.FRONT_END_URL}/mysnippets/?t=${token}`);
		} catch (error) {
			console.log(error);
			next(error);
		}
	} else {
		res.send("Logged out");
	}
});

app.get("/isAdmin", (req, res, next) => {
	res.json(req.user.role === "admin" ? {isAdmin: true} : {isAdmin: false});
});

app.post("/callback", (req, res, next) => {
	res.redirect("/");
});

app.get("/logout-direct", (req, res) => {
	res.redirect(
		`${process.env.ISSUERBASEURL}/v2/logout?client_id=${process.env.CLIENTID}&returnTo=${process.env.FRONT_END_URL}/`
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

app.get("/profile-pic", (req, res, next) => {
	try {
		if (req.user) res.json({profilePic: req.user.profilePic});
		else throw new Error("No user found");
	} catch (error) {
		console.log(error);
		next(error);
	}
});

app.get("/me", async (req, res, next) => {
	try {
		if (req.user) res.json({user: req.user});
		else throw new Error("No user found");
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

module.exports = app;
