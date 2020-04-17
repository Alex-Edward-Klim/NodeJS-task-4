const { createLogger, transports } = require('winston');

const logger = createLogger({
  level: 'silly',
  transports: [
    new transports.Console(),
    new transports.File({
      filename: './src/LOGS/error.log',
      level: 'error'
    }),
    new transports.File({
      filename: './src/LOGS/info.log',
      level: 'info'
    })
  ]
});

module.exports = logger;
