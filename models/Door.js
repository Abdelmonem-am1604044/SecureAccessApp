const mongoose = require('mongoose');

const DoorSchema = mongoose.Schema({
	doorName: {
		type: String,
		required: true,
		unique: true
	}
});

const Door = mongoose.model('Door', DoorSchema);

module.exports = Door;
