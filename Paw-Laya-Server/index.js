import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node'; // Correct import statement
import connectDB from './DB/db.js';
import './instrument.js'; // Setup Sentry for error handling
import adminAuth from './routes/admin/adminAuth.routes.js';
import adminUserRoutes from './routes/admin/admin.user.routes.js';
import adminAuthRoutes from './routes/admin/adminAuth.routes.js';
import adminPetRoutes from './routes/admin/admin.pet.routes.js';

//user
import userAuth from './routes/user/auth.routes.js';
import userPetRoutes from './routes/user/user.pet.routes.js';

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

// Admin routes
app.use('/pawlaya/api/v1/admin', adminAuth);
app.use('/pawlaya/api/v1/admin/user', adminUserRoutes);
app.use('/pawlaya/api/v1/admin/pet', adminPetRoutes);
app.use('/pawlaya/api/v1/admin/auth', adminAuthRoutes);

//User routes
app.use('/pawlaya/api/v1', userAuth);
app.use('/pawlaya/api/v1', userPetRoutes);
// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Express server connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
