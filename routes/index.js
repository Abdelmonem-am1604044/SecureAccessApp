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

router.route('/login').get((req, res) => res.render('login')).post(async (req, res, next) => {
	let user = await User.findOne({ username: req.body.username });
	if (user) {
		if (user.status == 'Unlocked') {
			passport.authenticate('local', function(err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					req.flash('error', 'Password and/or Username are Incorrect');
					return res.redirect('/login');
				}
				req.logIn(user, async function(err) {
					if (err) {
						return next(err);
					}
					req.flash('success', 'Welcome To Secure Access App ' + req.user.username);
					await new Record({
						user: req.user._id,
						dateAndTime: getTime(),
						status: 'Completed',
						type: 'User Login'
					}).save();
					return res.redirect('/');
				});
			})(req, res, next);
		} else {
			req.flash('error', 'Your Account is Locked');
			res.redirect('/login');
		}
	} else {
		req.flash('error', 'Password and/or Username are Incorrect');
		res.redirect('/login');
	}
});
// req.flash('success', 'Welcome To Secure Access App ' + req.user.username);
// 	res.redirect('/');
// 	await new Record({
// 		user: req.user._id,
// 		dateAndTime: getTime(),
// 		status: 'Completed',
// 		type: 'User Login'
// 	}).save();
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

// app.get('/login', function(req, res, next) {});
