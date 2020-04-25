/**
 * 
 * A file responsible for the routes related to the access point confirmation /api
 * 
 * 
 */
const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Door = require('../models/Door'),
	Record = require('../models/Record'),
	bcrypt = require('bcryptjs');

// get current date and time
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

// Function to handle the route /dooInput, and return the number of inputs required for each door
router.get('/doorInput', async (request, response) => {
	try {
		// retrieve the door from the database
		let door = await Door.findOne({ doorID: request.query.doorID });
		// check to see if the door exists in the database
		if (door) {
			// identify the the number of inputs required
			let inputs = door.sensitive ? 2 : 1;
			// return the number of inputs required
			response.json(inputs);
		} else {
			// door does not exist in the database
			response.json('Door with such ID does not exist');
		}
	} catch (error) {
		response.json(error);
	}
});

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
	let inputs;
	let door = await Door.findOne({ doorID: request.query.doorID });
	// check to see if the door exists in the database
	if (door) {
		// identify the the number of inputs required
		inputs = door.sensitive ? 2 : 1;
	} else {
		// door does not exist in the database
		response.json('Door with such ID does not exist');
	}

	// In case 2 inputs are required
	if (inputs === 2) {
		// check if 2 inputs are entered
		if (request.query.pin && request.query.RFID) {
			// retrieve the user with similar rfid as the passed one from the database
			let rfid_user = await User.findOne({ RFID: request.query.RFID }).populate('allowedDoors');
			// check if the user exists in the database
			if (rfid_user) {
				if (rfid_user.status == 'Unlocked') {
					// compare the pin number passed to the one stored in the database
					let match = await bcrypt.compare(request.query.pin, rfid_user.pin);
					// check to see if there is a match
					if (match) {
						// incase there is a match, check the passed doorID with the allowed doors in the database
						let allowed = rfid_user.allowedDoors.find((door) => door.doorID == request.query.doorID);
						await User.findOneAndUpdate({ _id: rfid_user._id }, { trials: 0 });
						if (allowed) {
							// in case of success
							response.json('Allowed');
							await new Record({
								user: rfid_user._id,
								dateAndTime: dateTime,
								status: 'Completed',
								type: `Successful Access through the access point ${allowed.doorName}`
							}).save();
						} else {
							// in case of failure
							response.json('Not Allowed');
							await new Record({
								user: rfid_user._id,
								dateAndTime: dateTime,
								status: 'Completed',
								type: `Failed access through the access point ${request.query.doorID}`
							}).save();
						}
					} else {
						let trials = ++rfid_user.trials;
						console.log(trials);
						if (trials >= 3) {
							trials = 0;
							await User.findOneAndUpdate({ _id: rfid_user._id }, { trials, status: 'Locked' });
							await new Record({
								user: rfid_user._id,
								dateAndTime: dateTime,
								status: 'Completed',
								type: `Account is Locked`
							}).save();
						} else {
							await User.findOneAndUpdate({ _id: rfid_user._id }, { trials });
						}
						response.json('RFID and/or Pin are Incorrect');
					}
				} else {
					response.json('Account is Locked');
				}
			} else {
				response.json('RFID and/or Pin are Incorrect');
			}
		} else {
			response.json('Please Provide Both Pin and RFID');
		}
	}
	// In case 1 input is required
	if (inputs === 1) {
		if (!request.query.pin && request.query.RFID) {
			// First case: user only passed the RFID
			// checking the passed RFID with the ones in database
			let user = await User.findOne({ RFID: request.query.RFID }).populate('allowedDoors');
			// in case there is a user with this RFID
			if (user) {
				if (user.status == 'Unlocked') {
					// check the passed doorID with the one in the database
					let allowed = user.allowedDoors.find((door) => door.doorID == request.query.doorID);
					// in case of success
					if (allowed) {
						response.json('Allowed');
						await new Record({
							user: user._id,
							dateAndTime: dateTime,
							status: 'Completed',
							type: `Successful Access through the access point ${allowed.doorName}`
						}).save();
					} else {
						// in case of failure
						response.json('Not Allowed');
						await new Record({
							user: user._id,
							dateAndTime: dateTime,
							status: 'Completed',
							type: `Failed access through the access point ${request.query.doorID}`
						}).save();
					}
				} else {
					response.json('Account is Locked');
				}
			} else {
				response.json('Pin and/or RFID are incorrect');
			}
		} else if (request.query.pin && !request.query.RFID) {
			// Second Case: Using pin of the user only
			// retrieve all of the users from the database
			let users = await User.find();
			// loop across all of the users
			users.forEach(async (entry) => {
				// compare the passed pin, with each user's pin, to get the right user
				let match = await bcrypt.compare(request.query.pin, entry.pin);
				if (match) {
					if (entry.status == 'Unlocked') {
						// in case there is match, retrieve his allowed doors
						let user = await User.findOne({ _id: entry._id }).populate('allowedDoors');
						// check the passed doorID with the one in the database
						let allowed = user.allowedDoors.find((door) => door.doorID == request.query.doorID);
						if (allowed) {
							// in case of success
							response.json('Allowed');
							await new Record({
								user: user._id,
								dateAndTime: dateTime,
								status: 'Completed',
								type: `Successful Access through the access point ${allowed.doorName}`
							}).save();
						} else {
							// in case of failure
							response.json('Not Allowed');
							await new Record({
								user: user._id,
								dateAndTime: dateTime,
								status: 'Completed',
								type: `Failed access through the access point ${request.query.doorID}`
							}).save();
						}
					}
				} else {
					response.json('Account is Locked');
				}
			});
		}
	}
});

module.exports = router;
