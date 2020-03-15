const express = require('express'),
	router = express.Router(),
	Door = require('../models/Door'),
	Record = require('../models/Record');

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var dateTime = date + ' ' + time;

router.get('/add', (req, res) => {
	res.render('door/add');
});

router.post('/add', async (req, res) => {
	await new Door(req.body).save();
	await new Record({
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: 'New Access Point Added'
	}).save();
	res.redirect('/door/show');
});

router.get('/show', async (req, res) => {
	let doors = await Door.find({});
	res.render('door/show', { doors });
});

router.get('/:id', async (req, res) => {
	let door = await Door.findOne({ _id: req.params.id });
	res.render('door/index', { door });
});

router.post('/:id', async (req, res) => {
	let door = await Door.findOneAndUpdate({ _id: req.params.id }, req.body);
	await new Record({
		user: req.user._id,
		dateAndTime: dateTime,
		status: 'Completed',
		type: `Access Point Information Updated \'${door.doorName}\'`
	}).save();
	res.redirect('/door/show');
});

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
