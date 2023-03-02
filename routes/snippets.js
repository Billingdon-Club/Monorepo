const e = require("express");
const express = require("express");
const {Snippet} = require("../db");
const app = express();

const detectLang = require("lang-detector");

const PAGE_LIMIT = 15;

const snippets = express.Router();

snippets.get("/all/:pageNum", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			if (req.user.role !== "admin") throw new Error("Admin Access Only");
			else {
				const snippets = await Snippet.find()
					.populate("owner")
					.limit(PAGE_LIMIT * req.params.pageNum)
					.sort({createdAt: -1});
				res.status(200).send({snippets: snippets});
			}
		}
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
				owner: req.user,
				content,
				createdAt: new Date(),
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
			const deleteParams = {_id: req.params.id};
			if (!req.user.role === "user") {
				deleteParams["owner"] = req.user;
			}
			const deletedSnippet = await Snippet.deleteOne(deleteParams);
			res.status(200).send({success: true, snippet: deletedSnippet});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

snippets.get("/:pageNum", async (req, res, next) => {
	try {
		if (!req.user) throw new Error("No User Found");
		else {
			const snippets = await Snippet.find({
				owner: req.user,
			})
				.limit(PAGE_LIMIT * req.params.pageNum)
				.sort({createdAt: -1});
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
			const updateParams = {_id: req.params.id};
			if (!req.user.role === "user") {
				updateParams["owner"] = req.user;
			}
			console.log(req.body);
			const {language, content} = req.body;
			const updatedSnippet = await Snippet.findOneAndUpdate(updateParams, {
				content,
				language,
			});
			res.status(200).send({success: true, updatedSnippet});
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
module.exports = snippets;
