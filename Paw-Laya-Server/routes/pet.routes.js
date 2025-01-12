import express from 'express';
import { createPet } from '../controllers/pet.controllers.js';

const route = express.Router();

route.post('/create', createPet);

export default route;
