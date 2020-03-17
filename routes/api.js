const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Door = require('../models/Door'),
	ObjectId = require('mongodb').ObjectId,
	Record = require('../models/Record'),
	passport = require('passport');

router.get('/confirm', async (req, res) => {


	let m = await User.findOne({ RFID: req.query.RFID }).populate('allowedDoors');


	if (m) {
		if (m.status == 'Unlocked') {
			passport.authenticate('local', function(err, user, info) {
				if (err) {
					res.json({ message: 'Password and/or RFID are Incorrect' });
				}
				if (!user) {
					res.json({ message: 'Password and/or RFID are Incorrect' });
				}
				req.logIn(user, async function(err) {
					if (err) {
						res.json({ message: 'Password and/or RFID are Incorrect' });
					}
					let d = m.allowedDoors.find((x) => x.doorID == req.query.doorID);
					if (d) res.json({ message: 'Allowed' });
					else res.json({ message: 'Not Allowed' });
				});
			})(req, res);
		} else {
			res.json({ message: 'Account is Locked' });
		}
	} else {
		res.json({ message: 'Password and/or RFID are Incorrect' });
	}
});

module.exports = router;
