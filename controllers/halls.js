// import the express Router
const hallsRouter = require('express').Router();

// import the model
const Hall = require('../models/hall');

// endpoint to get all the Halls
// get rooms with booked Data
hallsRouter.get('/', async (request, response) => {
    await Hall.find({}, {}).populate("bookings", { name: 1, date: 1, startTime: 1, endTime: 1 })
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

    try {
        const hall = new Hall(request.body);

        const savedHall = await hall.save();

        response.status(201).json({ message: 'Hall created successfully', Hall: savedHall });
    } catch (error) {
        response.status(505).json({ message: error })
    }
});


module.exports = hallsRouter;