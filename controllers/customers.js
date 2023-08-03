// import the express Router
const customersRouter = require('express').Router();

// import the model
const Customer = require('../models/customer');

// endpoint to get all the customers
// List all customers with booked data
customersRouter.get('/', async (request, response) => {
    await Customer.find({}, {}).populate("bookings.booking", { bookedDate: 1, startTime: 1, endTime: 1 }).populate("bookings.hall", { name: 1 })
        .then((customers) => {
            response.json(customers);
        })
        .catch((error) => response.status(404).json({ message: error }))
});

// fetches a single resource
// get customer with all his booking details using id 
// And listing how many times a customer has booked a room
customersRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Customer.findById(id).populate("bookings.booking", { bookedDate: 1, startTime: 1, endTime: 1 }).populate("bookings.hall", { name: 1 })
        .then((customer) => {
            if (!customer) {
                return response.status(404).json({ error: 'Customer not found' });
            }
            response.json({
                customerName: customer.customerName,
                TotalBookings: customer.bookings.length,
                Bookings: customer.bookings
            });
        })
        .catch(error => next(error));
});

// creates a new customer on the request data
customersRouter.post('/', async (request, response, next) => {
    try {
        const customer = new Customer(request.body);

        const savedcustomer = await customer.save();

        response.status(201).json({ message: 'customer created successfully', customer: savedcustomer });
    } catch (error) {
        response.status(404).json({ message: error })
    }

});

module.exports = customersRouter;