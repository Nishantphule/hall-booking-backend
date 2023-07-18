const mongoose = require('mongoose');

// create a schema
const hallSchema = new mongoose.Schema({
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
            type:mongoose.Schema.Types.ObjectId,
            ref:'Booking'
        }
    ]
});

hallSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Hall', hallSchema);