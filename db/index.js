const Snippet = require("./models/Snippet");
const User = require("./models/User");

User.hasMany(Snippet);
Snippet.belongsTo(User);

module.exports = {Snippet, User};
