import { Door } from '../models/Door';

class DoorRepository {
	async addDoor(door) {
		return await new Door(door).save();
	}
}

module.exports = new DoorRepository();
