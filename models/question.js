var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	title: String,
	approvalStatus: {type: String},
	answer: {type: String, default: "" },
	submitter: String,
	upvotes: { type: Number, min: 0, default:0 },
	created_at: { type: Date, default: Date.now }
});

var Question = mongoose.model('Question', questionSchema);



module.exports = Question;