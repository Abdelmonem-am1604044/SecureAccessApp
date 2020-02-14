const router = require('express').Router(),
	RecordService = require('../services/RecordService'),
	UserService = require('../services/UserService');

router.route('/records').post(RecordService.addRecord).get(RecordService.getRecords);
router.route('/auth').post(UserService.register).delete(UserService.removeUser).get(UserService.login);

module.exports = router;
