import { Router } from 'express';
import { AvailableCarsController } from '../controllers/available-cars.controller';
import { asyncHandler } from '../middleware/validation.middleware';

const router = Router();
const availableCarsController = new AvailableCarsController();

router.post('/', 
  asyncHandler(availableCarsController.getAvailableCars.bind(availableCarsController))
);

router.get('/statistics', 
  asyncHandler(availableCarsController.getCarStatistics.bind(availableCarsController))
);

export default router;
