const Record = require('../models/Record');

class RecordRepository {
	async addLog(log) {
		console.log(log);
		return await new Record(log).save();
	}
}

module.exports = new RecordRepository();
