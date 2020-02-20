const mongoose = require('mongoose');

const DoorSchema = mongoose.Schema({
	DoorId: {
		type: String,
		required: true
	},
	DoorRole: {
		type: String,
		required: true
	}
});

const Door = mongoose.model('Door', DoorSchema);

module.exports = Door;
