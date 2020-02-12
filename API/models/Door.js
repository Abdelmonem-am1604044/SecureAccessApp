import { Schema, model } from 'mongoose';


const DoorSchema = Schema({
    DoorId:{
        type: String,
        required: true,
    },
    DoorRole: {
        type: String,
        required: true
    }
})

const Door = model('Door', DoorSchema);

module.exports = Door;