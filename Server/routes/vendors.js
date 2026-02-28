import express from 'express';
const router = express.Router();
import { listVendors, createVendor } from '../controllers/vendorController.js';
import { vendorCreateValidators } from '../utils/validators.js';

router.get('/', listVendors);
router.post('/', vendorCreateValidators, createVendor);

export default router;
