const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// create a schema
const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        unique: true
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            roomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Hall'
            }
        }
    ]
});

customerSchema.plugin(uniqueValidator);

customerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.customerId = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Customer', customerSchema);