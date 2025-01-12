import express from 'express';
import { deleteUser, getAllUser, getUser } from '../controllers/admin.controller.js';
import { authorizeAdmin } from '../middlewares/authMidlleWare.js';
import authenticateToken from '../middlewares/authenticateToken.js';
const route = express.Router();

route.get('/:id', authenticateToken, authorizeAdmin, getUser);
route.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);
route.get('/', authenticateToken, authorizeAdmin, getAllUser);

export default route;
