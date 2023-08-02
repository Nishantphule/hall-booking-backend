// import the express Router
const bookingsRouter = require('express').Router();

// import the model
const Customer = require('../models/customer');
const Booking = require('../models/booking');
const Hall = require('../models/hall');

// endpoint to get all the bookings
// get All the customers bookings
bookingsRouter.get('/', async (request, response) => {
    await Booking.find({}, {}).populate("hall", { name: 1, price: 1 }).populate("customer", { customerName: 1 })
        .then((bookings) => {
            response.json(bookings);
        });
});


// fetches a single resource
bookingsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Booking.findById(id).populate("hall", { name: 1, price: 1 }).populate("customer", { customerName: 1 })
        .then((booking) => {
            if (!booking) {
                return response.status(404).json({ error: 'Booking not found' });
            }
            return response.json(booking);
        })
        .catch(error => next(error));
});


// creates a new resource based on the request data
bookingsRouter.post('/', async (request, response) => {

    try {
        const booking = new Booking(request.body);

        const hall = await Hall.findById(booking.hall);

        const customer = await Customer.findById(booking.customer)

        const prevBookings = hall.bookings;

        let bookingStartTime = Number(booking.startTime.substring(0, 2))
        let bookingEndTime = Number(booking.endTime.substring(0, 2))

        async function savebooking() {
            if (bookingStartTime < 6 || bookingStartTime > 20) {
                response.status(302).json({ message: 'Try booking hall for time after 6 am and before 8 pm.' });
            }
            if (bookingStartTime > bookingEndTime) {
                response.status(302).json({ message: 'End Time should not be before Start time.' });
            }
            if (bookingEndTime - bookingStartTime > 4) {
                response.status(302).json({ message: 'Time for which the hall is booked should not be greater than 4 hours' });
            }
            else {
                const savedbooking = await booking.save();

                hall.bookings = hall.bookings.concat(savedbooking.id)
                await hall.save();

                customer.bookings = customer.bookings.concat({
                    booking: savedbooking.id,
                    hall: savedbooking.hall
                })

                await customer.save();

                response.status(200).json({ message: 'booking created successfully', booking: savedbooking });
            }
        }

        if (prevBookings.length === 0) {

            savebooking();
        }
        else {

            let bookingOnSameDate = []

            for (var i = 0; i < prevBookings.length; i++) {
                let check = await Booking.findById(prevBookings[i].toString());
                if (check.bookedDate === booking.bookedDate) {
                    bookingOnSameDate.push([Number(check.startTime.substring(0, 2)), Number(check.endTime.substring(0, 2))])
                }
            }
            let overlapTime = false
            for (var i = 0; i < bookingOnSameDate.length; i++) {
                if (bookingStartTime === bookingOnSameDate[i][0]) {
                    overlapTime = true;
                    break;
                }
                else if (bookingStartTime > bookingOnSameDate[i][0] && bookingStartTime < bookingOnSameDate[i][1]) {
                    overlapTime = true;
                    break;
                }
                else if (bookingOnSameDate[i][0] > bookingStartTime && bookingOnSameDate[i][0] < bookingEndTime) {
                    overlapTime = true;
                    break;
                }
            }

            if (overlapTime) {
                response.json({ message: "Time Overlapping with another booking try another Time" })
            }
            else if (bookingStartTime < 6 || bookingStartTime > 20) {
                response.status(302).json({ message: 'Try booking hall for time after 6 am and before 8 pm.' });
            }
            else if (bookingStartTime > bookingEndTime) {
                response.status(302).json({ message: 'End Time should not be before Start time.' });
            }
            else if (bookingEndTime - bookingStartTime > 4) {
                response.status(302).json({ message: 'Time for which the hall is booked should not be greater than 4 hours' });
            }
            else {
                savebooking();
            }
        }




    } catch (error) {
        response.status(504).json({ message: "Internal server Error", error })
    }


});


module.exports = bookingsRouter;