const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// create a schema
const hallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    noOfSeats: {
        type: Number,
        required: true,
    },
    aminities: [
        {
            type: String,
        }
    ],
    price: {
        type: String,
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
});

hallSchema.plugin(uniqueValidator);

hallSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.roomId = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Hall', hallSchema);