import { Router } from 'express';
import { createDevamsizlik, getTodayBySofor } from '../controllers/devamsizlikController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('VELI', 'OGRETMEN'), createDevamsizlik);

// Şoför kendi bugünkü bildirimleri görebilir
router.get('/sofor/:soforId', authenticate, authorize('SOFOR', 'ADMIN'), getTodayBySofor);

export default router;