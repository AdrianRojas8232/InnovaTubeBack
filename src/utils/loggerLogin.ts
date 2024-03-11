import winston from 'winston';

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'loggerLoginError.log' }),
    ]
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'loggerLogin.log' }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    errorLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));

    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export { logger, errorLogger };
