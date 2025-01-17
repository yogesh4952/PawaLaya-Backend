// Init router
import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import { authorizeAdmin } from '../../middlewares/authMidlleWare.js';
import {
  deleteUser,
  getAllUser,
  getUser,
} from '../../controllers/admin/admin.user.controllers.js';

const route = express.Router();

//Users
route.get('/:id', authenticateToken, authorizeAdmin, getUser);
route.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);
route.get('/', authenticateToken, authorizeAdmin, getAllUser);

export default route;
