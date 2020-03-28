/**
 * 
 *  A file responsible for any route related to /user
 * 
 */

const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Door = require('../models/Door'),
	Record = require('../models/Record');

// get current date and time
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

router
	.route('/new')
	.get(async (req, res) => {
		// route to show the form to add new user
		let doors = await Door.find({});
		res.render('user/new', { doors });
	})
	.post(async (req, res) => {
		// route to submit the new user information to the database, and add a record accordingly
		let allowedDoors = [];
		let doors = req.body.doorName;
		// this below part is to add the allowedDoors from the from to the database
		if (typeof doors == 'string') {
			allowedDoors.push(doors);
		} else if (typeof doors == 'object') {
			doors.forEach((door) => {
				door = door.trim();
				allowedDoors.push(door);
			});
		}
		// get the rest of the information from the form, like username, password, etc.
		let { username, password, RFID, role } = req.body;
		// add the new user to the database, with the information passed from the form
		let newUser = await new User({ username, RFID, role, allowedDoors });
		// convert the password stored in the database to hash and salt, to prevent from hacking, using a predefined function
		User.register(newUser, password, (err, user) => {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('/user/new');
			}
			req.flash('success', `New User Added: ${user.username}`);
			res.redirect('/user/show');
		});
		// add new record, related to the new user addition
		await new Record({
			user: req.user._id,
			dateAndTime: dateTime,
			status: 'Completed',
			type: `New Account Added \'${newUser.username}\'`
		}).save();
		res.redirect('/user/show');
	});
// function to handle the route to show all the users
router.get('/show', async (req, res) => {
	let users = await User.find({}).populate('allowedDoors');
	let doors = await Door.find({});
	res.render('user/show', { users, doors });
});

// function to show a specific user, according to his id
router.get('/:id', async (req, res) => {
	let user = await User.findOne({ _id: req.params.id }).populate('allowedDoors');
	let doors = await Door.find({});
	res.render('user/index', { user, doors });
});

// function to handle the route to update a specific user
router.post('/:id', async (req, res) => {
	let { username, role, status } = req.body;
	let doors = req.body.doorName;
	let allowedDoors = [];
	if (typeof doors == 'string') {
		allowedDoors.push(doors);
	} else if (typeof doors == 'object') {
		doors.forEach((door) => {
			door = door.trim();
			allowedDoors.push(door);
		});
	}
	let user = await User.findOneAndUpdate({ _id: req.params.id }, { username, role, status, allowedDoors });
	await new Record({
		user: user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: `Account Information Updated '${user.username}'`
	}).save();
	res.redirect('/user/show');
});

// function to handle the route to delete a specific user, and delete his related records
router.post('/delete/:id', async (req, res) => {
	let user = await User.findOneAndDelete({ _id: req.params.id });
	await Record.deleteMany({ user: req.params.id }); // delete his related records
	await new Record({
		// add a record, to delete the user
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: `Account Deleted '${user.username}' `
	}).save();
	res.redirect('/user/show');
});

module.exports = router;
