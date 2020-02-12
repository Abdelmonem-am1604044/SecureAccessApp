const LogService = require('../services/RecordService');
const router = require('express').Router();

router.post('/record', LogService.addLog);

module.exports = router;
