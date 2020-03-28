/**
 * 
 * a file responsible for all the routes related to /records
 * 
 */

const express = require('express'),
	router = express.Router(),
	Record = require('../models/Record');

/**
 * 
 * a function for the the route '/records/show'
 * 
 * retrieve all records, and filter them according to the signed in user, and then send them to the view to show them
 * 
 */
router.get('/show', async (req, res) => {
	let records;
	if (req.user.role == 'Employee') {
		records = await Record.find({ user: req.user._id }).populate('user');
	} else records = await Record.find().populate('user');
	res.render('records/show', { records, currentUser: req.user });
});

module.exports = router;
