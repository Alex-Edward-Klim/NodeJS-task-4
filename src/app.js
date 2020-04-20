const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const taskRouter = require('./resources/tasks/task.router').router;
const logger = require('./LOGS/logger');
const HttpStatus = require('http-status-codes');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

app.use(express.json());

app.use((req, res, next) => {
  const objectToLog = {
    url: req.url,
    'query parameters': req.query,
    body: req.body
  };
  logger.info(objectToLog);
  next();
});

process.on('uncaughtException', error => {
  logger.error(`captured error: ${error.message}`);
  const exit = process.exit;
  exit(1);
});

process.on('unhandledRejection', reason => {
  logger.error(`Unhandled rejection detected: ${reason.message}`);
});

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/users', userRouter);
app.use('/boards', boardRouter);
boardRouter.use('/:boardId/tasks', taskRouter);

app.use((err, req, res, next) => {
  if (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
    logger.error(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
    return;
  }
  next();
});

module.exports = app;
