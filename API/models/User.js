import { Schema, model } from 'mongoose';

const UserSchema = Schema({
	given_name: {
		type: String,
		required: true,
		trim: true
	},
	family_name: {
		type: String,
		required: true,
		trim: true
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
		enum: ['employee','admin']
	},
	status: {}
});

const User = model('User', UserSchema);

module.exports = User;
