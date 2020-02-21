const express = require('express'),
	router = express.Router(),
	Record = require('../models/Record');

router.get('/show', async (req, res) => {
	let records;
	if (req.user.role == 'Employee') {
		records = await Record.find({ user: req.user._id }).populate('user');
	} else records = await Record.find().populate('user');
	res.render('records/show', { records, currentUser: req.user });
});

module.exports = router;
