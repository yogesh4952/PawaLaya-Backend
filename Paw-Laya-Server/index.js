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
import adoptionRoutes from './routes/user/adoption.routes.js';
import adoptionApplication from './routes/admin/applicationManagement.routes.js';
// User
import userAuth from './routes/user/auth.routes.js';
import userPetRoutes from './routes/user/user.pet.routes.js';
import authenticateToken from './middlewares/authenticateToken.js';
import authorizeRoles from './middlewares/checkRole.js';

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

// Admin routes (requires 'admin' role)
app.use('/pawlaya/api/v1/admin', adminAuth);

app.use(
  '/pawlaya/api/v1/admin/user',
  authenticateToken,
  authorizeRoles(['admin']),
  adminUserRoutes
);

app.use(
  '/pawlaya/api/v1/admin/pet',
  authenticateToken,
  authorizeRoles(['admin']),
  adminPetRoutes
);

app.use(
  '/pawlaya/api/v1/admin/auth',
  authenticateToken,
  authorizeRoles(['admin']),
  adminAuthRoutes
);

app.use(
  '/pawlaya/api/v1/admin/application',
  authenticateToken,
  authorizeRoles(['admin']),
  adoptionApplication
);

// User routes (requires 'user' role)
app.use(
  '/pawlaya/api/v1',
  authenticateToken, // Validates token
  authorizeRoles(['user']), // Restricts access to users only
  userAuth
);

app.use(
  '/pawlaya/api/v1',
  authenticateToken,
  authorizeRoles(['user']),
  userPetRoutes
);

app.use(
  '/pawlaya/api/v1/adoption',
  authenticateToken,
  authorizeRoles(['user']),
  adoptionRoutes
);

// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Global error handler (optional, for catching uncaught errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
  });
});

// Express server connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
