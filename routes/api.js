/**
 * 
 * A file responsible for the routes related to the access point confirmation
 * 
 * 
 */

const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Record = require('../models/Record'),
	passport = require('passport');

// get current date and time
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

/**
	 * 
	 * A function for the route /confirm, used to confirm the access point for a user
	 * 
	 * using two cases:
	 * 	- using only the RFID of the user
	 * 	- using username and password of the user 
	 * 
	 */
router.get('/confirm', async (request, response) => {
	// First Case: Using RFID of the user
	if (!request.query.username && !request.query.password) {
		// checking the passed RFID with the ones in database
		let user = await User.findOne({ RFID: request.query.RFID }).populate('allowedDoors');
		// in case there is a user with this RFID
		if (user) {
			// check the passed doorID with the one in the database
			let allowed = user.allowedDoors.find((door) => door.doorID == request.query.doorID);
			// in case of success
			if (allowed) {
				response.json({ message: 'Allowed' });
				await new Record({
					user: user._id,
					dateAndTime: dateTime,
					status: 'Completed',
					type: `Successful Access through the access point ${allowed.doorName}`
				}).save();
			} else {
				// in case of failure
				response.json({ message: 'Not Allowed' });
				await new Record({
					user: user._id,
					dateAndTime: dateTime,
					status: 'Completed',
					type: `Failed access through the access point ${request.query.doorID}`
				}).save();
			}
		} else {
			// in case there is no user with this RFID
			response.json({ message: 'User with such RFID does not exist' });
		}
	} else {
		// Second Case: Using username and password of the user
		// checking the passed username and password with the ones in database, using a predefined function
		passport.authenticate('local', async function(err, user) {
			// in case there is an error
			if (err) {
				response.json({ message: 'Password and/or username are Incorrect' });
			}
			// in case username and password are not correct
			if (!user) {
				response.json({ message: 'Password and/or username are Incorrect' });
			}
			// in case of there a user of such username and password
			let newUser = await User.findOne({ _id: user._id }).populate('allowedDoors');
			// retrieve his allowed access points
			let allowed = newUser.allowedDoors.find((door) => door.doorID == request.query.doorID);
			// in case of success
			if (allowed) {
				response.json({ message: 'Allowed' });
				await new Record({
					user: newUser._id,
					dateAndTime: dateTime,
					status: 'Completed',
					type: `Successful Access through the access point ${allowed.doorName}`
				}).save();
			} else {
				// in case of failure
				response.json({ message: 'Not Allowed' });
				await new Record({
					user: newUser._id,
					dateAndTime: dateTime,
					status: 'Completed',
					type: `Failed access through the access point ${request.query.doorID}`
				}).save();
			}
		})(request, response);
	}
});

module.exports = router;
