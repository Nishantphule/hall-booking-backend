const logger = require('./logger');

// requestLogger middleware
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:', request.path);
    logger.info('Body:', request.body);
    logger.info('--------');
    next();// yielding the control to the next middleware
}

// middleware for catching requests that are made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

// Express error handlers - middleware
// handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: "Invalid token" });
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: "Token expired" });
    }

    next(error);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}