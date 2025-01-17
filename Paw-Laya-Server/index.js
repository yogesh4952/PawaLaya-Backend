import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node'; // Correct import statement
import connectDB from './DB/db.js';
import AuthRoutes from './routes/user/auth.routes.js';
import './instrument.js'; // Setup Sentry for error handling
import adminRoutes from './routes/admin/admin.routes.js';
import adminAuthRoutes from './routes/admin/adminAuth.routes.js';

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
app.use('/pawlaya/api/v1/auth', AuthRoutes);
app.use('/pawlaya/api/v1/admin', adminRoutes);
app.use('/pawlaya/api/v1/admin/auth', adminAuthRoutes);

// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Express server connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
