// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
UserSchema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
});
module.exports = mongoose.model("User", UserSchema);