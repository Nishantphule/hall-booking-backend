// import the express Router
const hallsRouter = require('express').Router();

// import the model
const Hall = require('../models/hall');
const Booking = require('../models/booking');

// endpoint to get all the Halls
hallsRouter.get('/', async (request, response) => {
    await Hall.find({}, {}).populate("bookings",{customerName:1 ,date:1, startTime:1})
        .then((halls) => {
            response.json(halls);
        });
});

// fetches a single resource
hallsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Hall.findById(id)
        .then((hall) => {
            if (!hall) {
                return response.status(404).json({ error: 'Hall not found' });
            }
            return response.json(hall);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
hallsRouter.post('/', async (request, response, next) => {

    const hall = new Hall(request.body);

    const savedHall = await hall.save();

    response.status(201).json({ message: 'Hall created successfully', Hall: savedHall });
});

// deletes a single resource
hallsRouter.delete('/:id', (request, response) => {
    const id = request.params.id;

    Hall.findByIdAndDelete(id)
        .then((deletedHall) => {
            if (!deletedHall) {
                return response.status(404).json({ error: 'Hall not found' });
            }
            else {
                return response.status(204).json({ message: 'Hall deleted successfully' });
            }
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// patch request to update the identified resource with the request data
hallsRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const hallToPatch = request.body;

    Hall.findByIdAndUpdate(id, hallToPatch)
        .then((updatedHall) => {
            if (!updatedHall) {
                return response.status(404).json({ error: 'Hall not found' });
            }
            response.json(updatedHall);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// put request to replace the entire identified resource with the request data
hallsRouter.put('/:id', (request, response) => {
    const id = request.params.id;
    const hallToPut = request.body;

    Hall.findByIdAndUpdate(id, hallToPut)
        .then((updatedHall) => {
            if (!updatedHall) {
                return response.status(404).json({ error: 'Hall not found' });
            }
            response.json(updatedHall);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = hallsRouter;