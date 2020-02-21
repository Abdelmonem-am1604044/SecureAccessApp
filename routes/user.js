const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Door = require('../models/Door'),
	Record = require('../models/Record');

router.get('/show', async (req, res) => {
    let users = await User.find({}).populate('allowedDoors');
    let doors = await Door.find({})
	res.render('user/show', { users, doors });
});

module.exports = router;
