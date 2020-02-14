const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: false,
		trim: true
	},
	role: {
		type: String,
		required: true,
		trim: true,
		enum: [ 'Employee', 'Admin' ]
	},
	status: {
		type: String,
		default: 'Unlocked',
		enum: [ 'Unlocked', 'Unlocked' ]
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
