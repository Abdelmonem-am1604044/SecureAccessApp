const router = require('express').Router(),
	RecordService = require('../services/RecordService'),
	UserService = require('../services/UserService'),
	DoorService = require('../services/DoorService');

router.route('/auth').post(UserService.register).get(UserService.login);

router.route('/*').all(UserService.isAuthenticated);

router.route('/user').delete(UserService.removeUser).put(UserService.updateUser);

router.route('/record').post(RecordService.addRecord).get(RecordService.getRecords);

router.route('/door').post(DoorService.addDoor);

module.exports = router;
