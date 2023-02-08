require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5002;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});
