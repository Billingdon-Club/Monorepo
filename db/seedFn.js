const db = require("./db");
const {User, Snippet} = require("./index");
const {faker} = require("@faker-js/faker");

async function seed() {
	await db.sync({force: true});

	for (let i = 0; i < 100; i++) {
		await User.create({
			username: faker.internet.userName(),
			name: faker.name.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			profilePic: faker.internet.avatar(),
			role: "user",
		});

		await Snippet.create({
			title: "Another code snippet",
			content: `function add(a, b) {\n  return a + b;\n}`,
			language: "js",
			UserId: i + 1,
		});
	}

	console.log("Seeded");
}

seed();
