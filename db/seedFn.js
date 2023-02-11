const db = require("./db");
const {User} = require("./index");
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
	}

	console.log("Seeded");
}

seed();
