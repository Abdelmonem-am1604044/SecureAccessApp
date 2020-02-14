const Record = require('../models/Record');

class RecordRepository {
	async addRecord(log) {
		try {
			await new Record(log).save();
			return log;
		} catch (error) {
			return error;
		}
	}

	async getRecords() {
		try {
			const records = await Record.find();
			return records;
		} catch (error) {
			return error;
		}
	}
}

module.exports = new RecordRepository();
