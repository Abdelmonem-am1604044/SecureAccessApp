const express = require('express'),
	router = express.Router(),
	Record = require('../models/Record');

router.get('/show', async (req, res) => {
	let records = await Record.find({}).populate('user');
	console.log(records);
	res.render('records', { records, currentUser: req.user });
});

module.exports = router;
