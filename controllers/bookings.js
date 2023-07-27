// import the express Router
const bookingsRouter = require('express').Router();

// import the model
const Customer = require('../models/customer');
const Booking = require('../models/booking');
const Hall = require('../models/hall');

// endpoint to get all the bookings
// get All the customers bookings
bookingsRouter.get('/', async (request, response) => {
    await Booking.find({}, {}).populate("roomId", { name: 1, noOfSeats: 1, aminities: 1, price: 1 }).populate("customerId", { customerName: 1 })
        .then((bookings) => {
            response.json(bookings);
        });
});

// fetches a single resource
bookingsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Booking.findById(id).populate("roomId", { name: 1, noOfSeats: 1, aminities: 1, price: 1 }).populate("customerId", { customerName: 1 })
        .then((booking) => {
            if (!booking) {
                return response.status(404).json({ error: 'Booking not found' });
            }
            return response.json(booking);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
bookingsRouter.post('/', async (request, response, next) => {

    try {
        const booking = new Booking(request.body);

        const hall = await Hall.findById(booking.roomId);

        const customer = await Customer.findById(booking.customerId)

        const prevBookings = hall.bookings;

        const savedbooking = await booking.save();

        hall.bookings = hall.bookings.concat(savedbooking.id)
        await hall.save();

        customer.bookings = customer.bookings.concat({
            bookingId: savedbooking.id,
            roomId: savedbooking.roomId
        })

        await customer.save();

        response.status(201).json({ message: 'booking created successfully', booking: savedbooking });


    } catch (error) {
        response.status(404).json({ message: 'Error in Creating Booking', error });
    }


});


module.exports = bookingsRouter;