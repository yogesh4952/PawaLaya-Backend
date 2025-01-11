const express = require('express');

//! Setup sentry for error handling
require('./instrument.js');
const Sentry = require('@sentry/node');

const app = express();
require('dotenv').config();

app.use(express.json());
// app.use('/pawalaya/v1');

app.get('/', (req, res) => {
  res.send('I am alive');
});

//Database call
const connectDB = require('./DB/db');
connectDB();

const AuthRoutes = require('./routes/auth.routes.js');
app.use('/pawalaya/api/v1/auth', AuthRoutes);

Sentry.setupExpressErrorHandler(app);

//Express Server connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
