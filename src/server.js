require('dotenv').config();

const { PORT } = require('./common/config');
const app = require('./app');

const connectToDB = callBackFunction => {
  const mongoose = require('mongoose');

  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    // Drop the DataBase!!!
    console.log('Connected to the DataBase!');
    callBackFunction();
  });
};

connectToDB(() => {
  app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
  );
});
