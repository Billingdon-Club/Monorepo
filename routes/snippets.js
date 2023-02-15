const express = require("express");
const {Snippet} = require("../db");
const app = express();

const snippets = express.Router();

snippets.get("/all", (req, res, next) => {});

snippets.post("/", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			const {title, content, language} = req.body;
			const newSnippet = await Snippet.create({
				UserId: req.user.id,
				title,
				content,
				language,
			});
			res.status(200).send({newSnippet: newSnippet});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.delete("/:id", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			const deletedSnippet = await Snippet.destroy({where: {id: req.body.id}});
			res.status(200).send({snippets: deletedSnippet});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.get("/", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			const snippets = await Snippet.findAll({where: {UserId: req.user.id}});
			res.status(200).send({snippets: snippets});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.patch("/", (req, res, next) => {});
module.exports = snippets;
