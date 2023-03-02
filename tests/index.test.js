require("dotenv").config();
const request = require("supertest");
const app = require("../src");
const connection = require("../db/db");

const jwt = require("jsonwebtoken");
const {User} = require("../db");

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

describe("Custom Base Endpoints", () => {
	// Created a test user, put his token in .env
	const token = process.env.TEST_USER_TOKEN;
	const adminToken = process.env.TEST_ADMIN_TOKEN;

	describe("GET /isAdmin", () => {
		it("With an admin account", async () => {
			const response = await request(app)
				.get("/isAdmin")
				.set({
					Authorization: `Bearer ${adminToken}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.isAdmin).toBe(true);
		});

		it("Without an admin account", async () => {
			const response = await request(app)
				.get("/isAdmin")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.isAdmin).toBe(false);
		});
	});

	describe("GET /isAuthenticated", () => {
		it("With a valid user account", async () => {
			const response = await request(app)
				.get("/isAuthenticated")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.isAuthenticated).toBe(true);
		});

		it("Without a valid user account", async () => {
			const response = await request(app).get("/isAuthenticated").set({
				"Content-Type": "application/json",
			});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.isAuthenticated).toBe(false);
		});
	});

	describe("GET /me", () => {
		it("With a valid user account", async () => {
			const response = await request(app)
				.get("/me")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});

			const retrievedData = jwt.verify(token, process.env.JWT_SECRET);

			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.user).toMatchObject({username: retrievedData.username});
		});

		it("Without a valid user account", async () => {
			const response = await request(app).get("/me").set({
				"Content-Type": "application/json",
			});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No user found");
		});
	});

	describe("GET /profile-pic", () => {
		it("With a valid user account", async () => {
			const response = await request(app)
				.get("/profile-pic")
				.set({
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				});

			const retrievedData = jwt.verify(token, process.env.JWT_SECRET);
			const retrievedUser = await User.findOne({
				username: retrievedData.username,
			}).exec();

			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.profilePic).toBe(retrievedUser.profilePic);
		});

		it("Without a valid user account", async () => {
			const response = await request(app).get("/profile-pic").set({
				"Content-Type": "application/json",
			});
			expect(response.status).toBe(500);
			expect(response.body).toBeDefined();
			expect(response.body.message).toBe("No user found");
		});
	});
});

describe("Endpoints from an Admin point of view", () => {
	// Created a test user, put his token in .env
	const adminToken = process.env.TEST_ADMIN_TOKEN;
	const token = process.env.TEST_USER_TOKEN;
	const testSnippet = {
		content: `function add(a, b) {\n  return a + b;\n}`,
		language: "javascript",
	};
	let testCreatedObject;

	beforeAll(async () => {
		const response = await request(app)
			.post("/snippets/")
			.send(testSnippet)
			.set({
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			});
		testCreatedObject = response.body.newSnippet;
		console.log(testCreatedObject);
	});

	describe("GET /snippets", () => {
		it("GET /all/:pageNum", async () => {
			const response = await request(app)
				.get("/snippets/all/1")
				.set({
					Authorization: `Bearer ${adminToken}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippets.length).toBeLessThanOrEqual(15);
		});
		it("GET (testing pagination) /all/:pageNum", async () => {
			const response = await request(app)
				.get("/snippets/all/2")
				.set({
					Authorization: `Bearer ${adminToken}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippets.length).toBeLessThanOrEqual(30);
		});
	});

	describe("PATCH /snippets", () => {
		it("PATCH  (a snippet the admin doesn't own) /:id", async () => {
			const updatedContent = {
				content: "function add(a, b) {\n  return 'New content';\n}",
				language: "javascript",
			};
			const response = await request(app)
				.patch(`/snippets/${testCreatedObject._id}`)
				.send(updatedContent)
				.set({
					Authorization: `Bearer ${adminToken}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.updatedSnippet).toMatchObject(updatedContent);
		});
	});

	describe("DELETE /snippets", () => {
		it("DELETE (a snippet the admin doesn't own) /:id", async () => {
			const response = await request(app)
				.delete(`/snippets/${testCreatedObject._id}`)
				.set({
					Authorization: `Bearer ${adminToken}`,
					"Content-Type": "application/json",
				});
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body.snippet).toMatchObject({
				acknowledged: true,
				deletedCount: 1,
			});
		});
	});
});
