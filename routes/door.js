/**
 * 
 * A file responsible for all the related routes of /door
 * 
 */

const express = require('express'),
	router = express.Router(),
	Door = require('../models/Door'),
	Record = require('../models/Record');

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

// function for showing the add access point view
router.get('/add', (req, res) => {
	res.render('door/add');
});

// function to add new Door to the database, and add new record
router.post('/add', async (req, res) => {
	let sensitive = req.body.sensitive ? true : false;
	let { doorName, doorID } = req.body;
	await new Door({ doorName, doorID, sensitive }).save();
	await new Record({
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: 'New Access Point Added'
	}).save();
	res.redirect('/door/show');
});

// function to show the list of access points
router.get('/show', async (req, res) => {
	let doors = await Door.find({});
	res.render('door/show', { doors });
});

// function to show a specific access point
router.get('/:id', async (req, res) => {
	let door = await Door.findOne({ _id: req.params.id });
	res.render('door/index', { door });
});

// function to update the information of a specific access point, and add new record
router.post('/:id', async (req, res) => {
	let sensitive = req.body.sensitive ? true : false;
	let { doorName, doorID } = req.body;
	let door = await Door.findOneAndUpdate({ _id: req.params.id }, { doorName, doorID, sensitive });
	await new Record({
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: `Access Point Information Updated \'${door.doorName}\'`
	}).save();
	res.redirect('/door/show');
});

// function to delete the information of a specific access point, and add new record
router.post('/delete/:id', async (req, res) => {
	let door = await Door.findOneAndDelete({ _id: req.params.id });
	await new Record({
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: `Access Point Information Deleted \'${door.doorName}\'`
	}).save();
	res.redirect('/door/show');
});

module.exports = router;
