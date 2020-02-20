const DoorRep = require('../repositories/DoorRepository');

class DoorService {

    async addDoor(req,res){
        try {
            const door = await DoorRep.addDoor(req.body)
            res.status(201).json(door)
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

module.exports = new DoorService()