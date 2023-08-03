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


// fetches a single resource by id
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


// creates a new Booking based on the request data
bookingsRouter.post('/', async (request, response) => {

    try {
        // getting the data from body
        const booking = new Booking(request.body);

        // getting the hall customer wants to book to check time and date overlapping 
        const hall = await Hall.findById(booking.hall);

        // getting customer so we can add booking details to customer id
        const customer = await Customer.findById(booking.customer)

        // getting previous bookings for the hall
        const prevBookings = hall.bookings;

        // booking start time and end time from booking request.
        let bookingStartTime = Number(booking.startTime.substring(0, 2))
        let bookingEndTime = Number(booking.endTime.substring(0, 2))

        // creating a save booking function to save the booking to customer id as well as hall id , if the booking meets all criteria. 
        async function savebooking() {
            if (bookingStartTime < 6 || bookingStartTime > 20) {
                response.status(302).json({ message: 'Try booking hall for time after 6 am and before 8 pm.' });
            }
            else if (bookingStartTime > bookingEndTime) {
                response.status(302).json({ message: 'End Time can not be before Start time.' });
            }
            else if (bookingEndTime - bookingStartTime > 4) {
                response.status(302).json({ message: 'Time for which the hall is booked can not be greater than 4 hours' });
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

        //  if there are no previous bookings for the specific date , directly go for save booking function
        if (prevBookings.length === 0) {
            savebooking();
        }

        // check overlapping of booking if there are previous bookings on the same date.
        else {
            let bookingOnSameDate = []

            // getting all the previous bookings details in array to check overlapping
            for (var i = 0; i < prevBookings.length; i++) {
                let check = await Booking.findById(prevBookings[i].toString());
                if (check.bookedDate === booking.bookedDate) {
                    bookingOnSameDate.push([Number(check.startTime.substring(0, 2)), Number(check.endTime.substring(0, 2))])
                }
            }

            // looping through previous bookings to check overlapping of time . if it overlaps the flag is set to true
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


            // checking all booking criteria before checking overlapping
            if (bookingStartTime < 6 || bookingStartTime > 20) {
                response.status(302).json({ message: 'Try booking hall for time after 6 am and before 8 pm.' });
            }
            else if (bookingStartTime > bookingEndTime) {
                response.status(302).json({ message: 'End Time can not be before Start time.' });
            }
            else if (bookingEndTime - bookingStartTime > 4) {
                response.status(302).json({ message: 'Time for which the hall is booked can not be greater than 4 hours' });
            }
            else if (overlapTime) {
                response.json({ message: "Time Overlapping with another booking try another Time or try another Date" })
            }
            // if time does not overlapping with any booking then you can save booking
            else {
                savebooking();
            }
        }


        // handling errors
    } catch (error) {
        response.status(504).json({ message: "Internal server Error", error })
    }


});


module.exports = bookingsRouter;