const e = require("express");
const express = require("express");
const {Snippet} = require("../db");
const app = express();

const detectLang = require("lang-detector");

const snippets = express.Router();

snippets.get("/all", (req, res, next) => {
	try {
		if (req.user.role !== "admin")
			throw new Error("This method is only accessible by site admins");
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.post("/", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			const {content} = req.body;
			const language = String(detectLang(content)).toLowerCase();
			const newSnippet = await Snippet.create({
				UserId: req.user.id,
				content,
				language,
			});
			res.status(200).send({success: true, newSnippet: newSnippet});
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
			const deletedSnippet = await Snippet.destroy({
				where: {id: req.params.id, UserId: req.user.id},
			});
			res.status(200).send({success: true, snippet: deletedSnippet});
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
			const snippets = await Snippet.findAll({
				where: {UserId: req.user.id},
				order: [["createdAt", "DESC"]],
			});
			res.status(200).send({snippets: snippets});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.patch("/:id", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			console.log(req.body);
			const {language, content} = req.body;
			const updatedSnippet = await Snippet.update(
				{content, language},
				{
					where: {id: req.params.id, UserId: req.user.id},
				}
			);
			res.status(200).send({success: true, updatedSnippet});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
module.exports = snippets;
