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
	res.render('door/show', {doors});
});

module.exports = router;
