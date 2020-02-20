const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dateAndTime: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;
