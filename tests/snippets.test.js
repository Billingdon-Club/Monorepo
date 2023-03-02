require("dotenv").config();
const request = require("supertest");
const app = require("../src");
const connection = require("../db/db");

describe("Endpoints from a User point of view", () => {
	// Created a test user, put his token in .env
	const token = process.env.TEST_USER_TOKEN;
	const testSnippet = {
		content: `function add(a, b) {\n  return a + b;\n}`,
		language: "javascript",
	};
	let testCreatedObject;

	beforeAll(async () => {
		connection();
	});
	describe("POST /snippets", () => {
		it("POST /", async () => {
			const response = await request(app)
				.post("/snippets/")
				.send(testSnippet)
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.newSnippet).toMatchObject(testSnippet);
			testCreatedObject = response.body.newSnippet;
		});

		it("POST (without valid user token. Will fail) /", async () => {
			const response = await request(app)
				.post("/snippets/")
				.send(testSnippet)
				.set({
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No User Found");
		});
	});

	describe("GET /snippets", () => {
		it("GET (first page) /:pageNum", async () => {
			const response = await request(app)
				.get("/snippets/1")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippets.length).toBeLessThanOrEqual(15);
		});

		it("GET (first & second page) /:pageNum", async () => {
			const response = await request(app)
				.get("/snippets/2")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippets.length).toBeLessThanOrEqual(30);
		});

		it("GET /all (Attempting to access an admin route. Will throw error)", async () => {
			const response = await request(app)
				.get("/snippets/all/1")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("Admin Access Only");
		});

		it("GET (without valid user token. Will fail) /:pageNum", async () => {
			const response = await request(app).get("/snippets/1").set({
				"Content-Type": "application/json",
			});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No User Found");
		});
	});

	describe("PATCH /snippets", () => {
		it("PATCH /:id", async () => {
			const updatedContent = {
				content: "function add(a, b) {\n  return 'New content';\n}",
				language: "javascript",
			};
			const response = await request(app)
				.patch(`/snippets/${testCreatedObject._id}`)
				.send(updatedContent)
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			console.log(testCreatedObject._id);
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.updatedSnippet).toMatchObject(updatedContent);
		});

		it("PATCH (without valid user token. Will fail) /:id", async () => {
			const updatedContent = {
				content: "function add(a, b) {\n  return 'New content';\n}",
				language: "javascript",
			};
			const response = await request(app)
				.patch(`/snippets/${testCreatedObject._id}`)
				.send(updatedContent)
				.set({
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No User Found");
		});
	});

	describe("DELETE /snippets", () => {
		it("DELETE /:id", async () => {
			const response = await request(app)
				.delete(`/snippets/${testCreatedObject._id}`)
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippet).toMatchObject({
				acknowledged: true,
				deletedCount: 1,
			});
		});

		it("DELETE (without valid user token. Will fail) /:id", async () => {
			const response = await request(app)
				.delete(`/snippets/${testCreatedObject._id}`)
				.set({
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No User Found");
		});
	});
});
