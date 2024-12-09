const winston = require('winston');
const { format } = winston;

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

const loggerMiddleware = (req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
        userId: req.user?.id
    });
    next();
};

module.exports = {
    logger,
    loggerMiddleware
}; 