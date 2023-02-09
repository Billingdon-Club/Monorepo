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
		res.redirect(process.env.FRONT_END_URL);
	}
	res.send("Logged out");
});

app.get("/isAuthenticated", (req, res) => {
	res.send(req.oidc.isAuthenticated() ? "logged_in" : "logged_out");
});

app.listen(PORT, () => {
	console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});
