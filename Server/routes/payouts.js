import express from 'express';
const router = express.Router();
import * as controller from '../controllers/payoutController.js';
import { payoutCreateValidators, payoutIdParam, rejectValidators } from '../utils/validators.js';

router.get('/', controller.listPayouts);
router.post('/', payoutCreateValidators, controller.createPayout);
router.get('/:id', payoutIdParam, controller.getPayout);
router.post('/:id/submit', payoutIdParam, controller.submitPayout);
router.post('/:id/approve', payoutIdParam, controller.approvePayout);
router.post('/:id/reject', rejectValidators, controller.rejectPayout);

export default router;
