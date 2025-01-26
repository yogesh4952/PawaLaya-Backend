import express from 'express';
import { getAllApplication } from '../../controllers/admin/adoptionApplicationManage.controllers.js';
const route = express.Router();

route.get('/', getAllApplication);

export default route;
