import {
  createPet,
  getPet,
  getAllPet,
  deletePet,
  updatePet,
} from '../../controllers/admin/admin.pet.controllers.js';

import express from 'express';
const route = express.Router();

//Authentication
//Pets
route.post('/', createPet);
route.get('/:id', getPet);
route.get('/', getAllPet);
route.delete('/:id', deletePet);
route.patch('/:id', updatePet);

export default route;
