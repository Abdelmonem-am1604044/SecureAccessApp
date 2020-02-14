const RecordRepository = require('../repositories/RecordRepository');

class RecordService {
	
	async addRecord(req, res) {
		try {
			const log = RecordRepository.addRecord(req.body);
			res.status(201).json(log);
		} catch (error) {
			res.status(500).send(error);
		}
	}

	async getRecords(req, res) {
		try {
			const records = await RecordRepository.getRecords();
			res.status(201).json(records);
		} catch (error) {
			res.status(500).send(error);
		}
	}
}

module.exports = new RecordService();
