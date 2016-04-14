var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	firstName: {type: String, default: ""},
	lastName: {type: String, default: ""},
	email: {type: String, default: ""},
	picture: {type: String, default: ""},
	questions: {type: [String], default: [""] },
	answers: {type: [String], default: [""] },
	type: {type: String, default: "" },
	description: {type: String, default: "" },
	created_at: { type: Date, default: Date.now }
});

var Profile = mongoose.model('Profile', profileSchema);



module.exports = Profile;