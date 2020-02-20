const bcrypt = require('bcrypt'),
	User = require('../models/User');
class UserRepository {
	async register(user) {
		try {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			const u = await new User(user).save();
			return u;
		} catch (error) {
			return error;
		}
	}

	async login(username, password) {
		let user = await User.findOne({ username }),
			match = false;

		if (user) match = await bcrypt.compare(password, user.password);
		if (match) {
			user = user.toObject();
			delete user.password;
			return user;
		} else throw 'Username and/or password Incorrect';
	}

	async removeUser(id) {
		try {
			const response = await User.findOneAndRemove({ _id: id });
			return response;
		} catch (error) {
			return error;
		}
	}

	async updateUser(user) {
		try {
			const salt = await bcrypt.genSalt(10);
			if (user.password) user.password = await bcrypt.hash(user.password, salt);
			const u = await User.findOneAndUpdate({ _id: user._id }, user);
			return u;
		} catch (error) {
			return error;
		}
	}
}

module.exports = new UserRepository();
