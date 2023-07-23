// import the express Router
const customersRouter = require('express').Router();

// import the model
const Customer = require('../models/customer');

// endpoint to get all the customers
customersRouter.get('/', async (request, response) => {
    await Customer.find({}, {}).populate("bookings", { roomId: 1, date: 1, startTime: 1, endTime: 1 })
        .then((customers) => {
            response.json(customers);
        });
});

// fetches a single resource
// get customer with booking details
customersRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Customer.findById(id).populate("bookings",{ roomId: 1, date:1, startTime:1, endTime:1})
        .then((customer) => {
            if (!customer) {
                return response.status(404).json({ error: 'Customer not found' });
            }
            response.json(customer);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
customersRouter.post('/', async (request, response, next) => {
    try {
        const customer = new Customer(request.body);

        const savedcustomer = await customer.save();

        response.status(201).json({ message: 'customer created successfully', customer: savedcustomer });
    } catch (error) {
        response.status(404).json({ message: error })
    }

});

// deletes a single resource
customersRouter.delete('/:id', (request, response) => {
    const id = request.params.id;

    Customer.findByIdAndDelete(id)
        .then((deletedcustomer) => {
            if (!deletedcustomer) {
                return response.status(404).json({ error: 'customer not found' });
            }
            else {
                return response.status(201).json({ message: 'customer deleted successfully' });
            }
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// patch request to update the identified resource with the request data
customersRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const customerToPatch = request.body;

    Customer.findByIdAndUpdate(id, customerToPatch)
        .then((updatedcustomer) => {
            if (!updatedcustomer) {
                return response.status(404).json({ error: 'customer not found' });
            }
            response.json(updatedcustomer);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// put request to replace the entire identified resource with the request data
customersRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const customerToPut = request.body;

    Customer.findByIdAndUpdate(id, customerToPut)
        .then((updatedcustomer) => {
            if (!updatedcustomer) {
                return response.status(404).json({ error: 'customer not found' });
            }
            response.json(updatedcustomer);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = customersRouter;