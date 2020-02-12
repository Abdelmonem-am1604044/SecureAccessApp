const RecordRepository = require('../repositories/RecordRepository');

class RecordService {
	async addLog(req, res) {
		try {
			const log = RecordRepository.addLog(req.body);
			res.status(201).json(log);
		} catch (error) {
			res.status(500).send(err);
		}
	}
}

module.exports = new RecordService();
