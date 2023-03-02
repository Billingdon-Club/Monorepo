const connection = require("./db");
const {User, Snippet} = require("./index");
const {faker} = require("@faker-js/faker");

async function seed() {
	await User.deleteMany();
	await Snippet.deleteMany();

	for (let i = 0; i < 100; i++) {
		const newUser = await User.create({
			username: faker.internet.userName(),
			name: faker.name.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			profilePic: faker.internet.avatar(),
			role: "user",
		});

		await Snippet.create({
			content: `function add(a, b) {\n  return a + b;\n}`,
			language: "javascript",
			createdAt: new Date(),
			owner: newUser,
		});
	}

	console.log("Seeded");
}

seed();

module.exports = seed;
