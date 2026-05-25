import { Router } from 'express';
import { getMyPayments, getAllPayments, createManualPayment, approvePayment } from '../controllers/odemeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, authorize('VELI'), getMyPayments);
router.get('/', authenticate, authorize('ADMIN'), getAllPayments);
router.post('/manual', authenticate, authorize('VELI'), createManualPayment);
router.put('/:id/approve', authenticate, authorize('ADMIN'), approvePayment);

export default router;