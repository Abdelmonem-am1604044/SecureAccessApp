/**
 * 
 * A file responsible for the routes related to the access point confirmation /api
 * 
 * 
 */

const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Record = require('../models/Record'),
	bcrypt = require('bcryptjs'),
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
	 * using three cases:
	 * 	- using only the RFID of the user
	 * 	- using username and password of the user 
	 *	- using username and password and rfid of the user
	 *  - using pin number and rfid
	 */
router.get('/confirm', async (request, response) => {
	// First Case: Using RFID of the user only
	if (!request.query.username && !request.query.pin && request.query.RFID) {
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
	} else if (request.query.username && request.query.pin && !request.query.RFID) {
		// Second Case: Using username and pin of the user only

		// retrieve a user with such username
		let user = await User.findOne({ username: request.query.username }).populate('allowedDoors');
		let match = false;
		// checking the passed username
		if (user) {
			// In case there is a match
			// checking if there is a match with the passed pin to the one stored in the database
			match = await bcrypt.compare(request.query.pin, user.pin);
			if (match) {
				// In case there is a match
				user = user.toObject();
				// retrieve the allowed doors from the database, and compare with the passed doorID
				let allowed = user.allowedDoors.find((door) => door.doorID == request.query.doorID);
				if (allowed) {
					// in case of success
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
				// in case there is an error
				response.json({ message: 'Username and/or Pin are Incorrect' });
			}
		} else {
			// in case there is an error
			response.json({ message: 'Username and/or Pin are Incorrect' });
		}
	} else if (request.query.username && request.query.pin && request.query.RFID) {
		// Third Case: checking username, pin and rfid of the user
		// checking the passed RFID with the ones in database
		let user = await User.findOne({ RFID: request.query.RFID }).populate('allowedDoors');
		// in case there is a user with this RFID
		if (user && user.username == request.query.username) {
			// retrieve a user with such username
			let user = await User.findOne({ username: request.query.username }).populate('allowedDoors');
			let match = false;
			// checking the passed username
			if (user) {
				// In case there is a match
				// checking if there is a match with the passed pin to the one stored in the database
				match = await bcrypt.compare(request.query.pin, user.pin);
				if (match) {
					// In case there is a match
					user = user.toObject();
					// retrieve the allowed doors from the database, and compare with the passed door
					let allowed = user.allowedDoors.find((door) => door.doorID == request.query.doorID);
					if (allowed) {
						// in case of success
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
					// in case there is an error
					response.json({ message: 'Username and/or Pin are Incorrect' });
				}
			} else {
				// in case there is an error
				response.json({ message: 'Username and/or Pin are Incorrect' });
			}
		} else {
			// in case there is no user with this RFID
			response.json({ message: 'User with such RFID does not exist' });
		}
	} else if (!request.query.username && request.query.pin && request.query.RFID) {
		let rfid_user = await User.findOne({ RFID: request.query.RFID }).populate('allowedDoors');
		if (rfid_user) {
			let match = await bcrypt.compare(request.query.pin, rfid_user.pin);
			if (match) {
				let allowed = rfid_user.allowedDoors.find((door) => door.doorID == request.query.doorID);
				if (allowed) {
					// in case of success
					response.json({ message: 'Allowed' });
					await new Record({
						user: rfid_user._id,
						dateAndTime: dateTime,
						status: 'Completed',
						type: `Successful Access through the access point ${allowed.doorName}`
					}).save();
				} else {
					// in case of failure
					response.json({ message: 'Not Allowed' });
					await new Record({
						user: rfid_user._id,
						dateAndTime: dateTime,
						status: 'Completed',
						type: `Failed access through the access point ${request.query.doorID}`
					}).save();
				}
			} else {
				response.json({ message: 'RFID and/or Pin are Incorrect' });
			}
		} else {
			response.json({ message: 'RFID and/or Pin are Incorrect' });
		}
	}
});

module.exports = router;
