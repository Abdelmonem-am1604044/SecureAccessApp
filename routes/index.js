/** 
 * 
 *  A file responsible for login, logout and showing the landing page
 * 
 * 
 * */

const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Record = require('../models/Record'),
	passport = require('passport');

// a function for showing the lading page
router.get('/', (req, res) => res.render('landing', { user: req.user }));

router
	.route('/login')
	.get((req, res) => res.render('login')) // function responsible for showing the login form
	.post(async (req, res, next) => {
		// function responsible confirm the username and password passed for login, and a record
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
							type: `User Login '${req.user.username}'`
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

// function responsible logout the logged in user, and a record
router.get('/logout', async function(req, res) {
	await new Record({
		user: req.user._id,
		dateAndTime: getTime(),
		status: 'Completed',
		type: `User Logout '${req.user.username}'`
	}).save();
	req.logout();
	req.flash('success', 'Logged Out Successfully');
	res.redirect('/');
});

// a function to get the current date and time
function getTime() {
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	var dateTime = date + ' ' + time;
	return dateTime;
}
module.exports = router;
