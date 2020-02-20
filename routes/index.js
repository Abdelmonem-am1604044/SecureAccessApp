const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Record = require('../models/Record'),
	passport = require('passport');

router.get('/', (req, res) => res.render('landing'));

router.route('/register').get((req, res) => res.render('register')).post(async (req, res) => {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Welcome To Secure Access App ' + user.username);
			res.redirect('/');
		});
	});
	await new Record({
		user: newUser._id,
		dateAndTime: getTime(),
		status: 'Completed',
		type: 'User Registration'
	}).save();
});

router.route('/login').get((req, res) => res.render('login')).post(passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}), async function(req, res) {
	req.flash('success', 'Welcome To Secure Access App ' + req.user.username);
	await new Record({
		user: req.user._id,
		dateAndTime: getTime(),
		status: 'Completed',
		type: 'User Login'
	}).save();
});

router.get('/logout', async function(req, res) {
	await new Record({
		user: req.user._id,
		dateAndTime: getTime(),
		status: 'Completed',
		type: 'User Logout'
	}).save();
	req.logout();
	req.flash('success', 'Logged Out Successfully');
	res.redirect('/');
});

function getTime() {
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	var dateTime = date + ' ' + time;
	return dateTime;
}
module.exports = router;
