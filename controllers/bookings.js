// import the express Router
const bookingsRouter = require('express').Router();

// import the model
const Booking = require('../models/booking');
const Hall = require('../models/hall');

// endpoint to get all the bookings
bookingsRouter.get('/', async (request, response) => {
    await Booking.find({}, {}).populate("roomId", {noOfSeats:1, aminities:1, price:1})
        .then((bookings) => {
            response.json(bookings);
        });
});

// fetches a single resource
bookingsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Booking.findById(id)
        .then((booking) => {
            if (!booking) {
                return response.status(404).json({ error: 'booking not found' });
            }
            response.json(booking);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
bookingsRouter.post('/', async (request, response, next) => {

    const booking = new Booking(request.body);
    
    const hall = await Hall.findById(booking.roomId);
    
    const savedbooking = await booking.save();
    
    hall.bookings = hall.bookings.concat(savedbooking.id)
    await hall.save();

    response.status(201).json({ message: 'booking created successfully', booking: savedbooking });
});

// deletes a single resource
bookingsRouter.delete('/:id', (request, response) => {
    const id = request.params.id;

    Booking.findByIdAndDelete(id)
        .then((deletedbooking) => {
            if (!deletedbooking) {
                return response.status(404).json({ error: 'booking not found' });
            }
            else {
                return response.status(204).json({ message: 'booking deleted successfully' });
            }
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// patch request to update the identified resource with the request data
bookingsRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const bookingToPatch = request.body;

    Booking.findByIdAndUpdate(id, bookingToPatch)
        .then((updatedbooking) => {
            if (!updatedbooking) {
                return response.status(404).json({ error: 'booking not found' });
            }
            response.json(updatedbooking);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// put request to replace the entire identified resource with the request data
bookingsRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const bookingToPut = request.body;

    Booking.findByIdAndUpdate(id, bookingToPut)
        .then((updatedbooking) => {
            if (!updatedbooking) {
                return response.status(404).json({ error: 'booking not found' });
            }
            response.json(updatedbooking);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = bookingsRouter;