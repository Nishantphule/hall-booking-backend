const mongoose = require('mongoose');

// create a schema
const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    dateOfBooking: {
        type: Date,
        default: Date.now
    },
    bookedDate: {
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
    hall: {
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