import express from 'express';
import {
  getAllPet,
  getPet,
} from '../../controllers//user/user.pet.controllers.js';
const route = express.Router();

route.get('/:id', getPet);
route.get('/', getAllPet);

export default route;
