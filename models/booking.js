const mongoose = require('mongoose');

// create a schema
const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    dateOfBooking: {
        type: Date,
        default: Date.now
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall'
    }
});


bookingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.bookingId = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Booking', bookingSchema);