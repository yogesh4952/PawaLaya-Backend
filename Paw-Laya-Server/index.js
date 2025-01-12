import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node'; // Correct import statement
import connectDB from './DB/db.js';
import AuthRoutes from './routes/auth.routes.js';
import './instrument.js'; // Setup Sentry for error handling

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
  res.send('I am alive');
});

// Database connection
connectDB();

// Authentication routes
app.use('/pawalaya/api/v1/auth', AuthRoutes);

// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Express server connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
