require("dotenv").config();
const express = require("express");
const app = express();
const {auth} = require("express-openid-connect");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const {
	oAuthAuthourizationCheck,
	JWTAuthenticationCheck,
} = require("../middleware");

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

app.get("/", (req, res) => {
	if (req.oidc.isAuthenticated()) {
		res.redirect(process.env.FRONT_END_URL + "/mysnippets");
	}
	res.send("Logged out");
});

app.get("/register", (req, res) => {
	res.oidc.login({
		authorizationParams: {
			screen_hint: "signup",
		},
	});
});

app.get("/isAuthenticated", (req, res) => {
	res.json(
		req.oidc.isAuthenticated()
			? {isAuthenticated: true}
			: {isAuthenticated: false}
	);
});

app.use((error, req, res, next) => {
	console.error("SERVER ERROR: ", error);
	if (res.statusCode < 400) res.status(500);
	res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
	console.log(`Snippets are ready at port: ${PORT}`);
});
