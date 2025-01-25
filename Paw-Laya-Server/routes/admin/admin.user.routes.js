// Init router
import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import {
  deleteUser,
  getAllUser,
  getUser,
} from '../../controllers/admin/admin.user.controllers.js';

const route = express.Router();

//Users
route.get('/:id', authenticateToken, getUser);
route.delete('/:id', authenticateToken, deleteUser);
route.get('/', authenticateToken, getAllUser);

export default route;
