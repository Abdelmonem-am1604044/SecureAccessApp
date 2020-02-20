const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

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
		enum: [ 'Employee', 'Admin' ],
		default: 'Employee'
	},
	status: {
		type: String,
		default: 'Unlocked',
		enum: [ 'Unlocked', 'Unlocked' ]
	}
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;
