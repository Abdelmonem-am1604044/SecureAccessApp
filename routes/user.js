const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Door = require('../models/Door'),
	ObjectId = require('mongodb').ObjectId,
	passport = require('passport'),
	Record = require('../models/Record');

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

router
	.route('/new')
	.get(async (req, res) => {
		let doors = await Door.find({});
		res.render('user/new', { doors });
	})
	.post(async (req, res) => {
		let allowedDoors = [];
		if (typeof doors == 'string') {
			allowedDoors.push(doors);
		} else if (typeof doors == 'object') {
			doors.forEach((door) => {
				door = door.trim();
				allowedDoors.push(door);
			});
		}
		let { username, password, RFID, role } = req.body;
		let newUser = await new User({ username, RFID, role, allowedDoors });
		User.register(newUser, password, (err, user) => {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('/user/new');
			}
			req.flash('success', `New User Added: ${user.username}`);
			res.redirect('/user/show');
		});
		await new Record({
			user: req.user._id,
			dateAndTime: dateTime,
			status: 'Completed',
			type: `New Account Added \'${user.username}\'`
		}).save();
		res.redirect('/user/show');
	});

router.get('/show', async (req, res) => {
	let users = await User.find({}).populate('allowedDoors');
	let doors = await Door.find({});
	res.render('user/show', { users, doors });
});

router.get('/:id', async (req, res) => {
	let user = await User.findOne({ _id: req.params.id }).populate('allowedDoors');
	let doors = await Door.find({});
	res.render('user/index', { user, doors });
});

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
		type: 'Account Information Updated'
	}).save();
	res.redirect('/user/show');
});

router.post('/delete/:id', async (req, res) => {
	let user = await User.findOneAndDelete({ _id: req.params.id });
	await new Record({
		user: user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: 'Account Deleted'
	}).save();
	res.redirect('/user/show');
});

module.exports = router;
