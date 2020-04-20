const mongoose = require('mongoose');

const DoorSchema = mongoose.Schema({
	doorName: {
		type: String,
		required: true,
		unique: true
	},
	doorID: {
		type: String,
		required: true,
		unique: true
	},
	sensitive: {
		type: Boolean,
		required: true
	}
});

const Door = mongoose.model('Door', DoorSchema);

module.exports = Door;
