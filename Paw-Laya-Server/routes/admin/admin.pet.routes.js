import {
  createPet,
  getAllPet,
  getPet,
} from '../../controllers/pet.controllers.js';

import express from 'express';
const route = express.Router();

//Authentication
//Pets
route.post('/pets/create', createPet);
route.get('/pets/:id', getPet);
route.get('/pets', getAllPet);

export default route;
