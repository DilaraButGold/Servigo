import { Router } from 'express';
import { submitLocation, getLastLocation } from '../controllers/konumController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Şoför konum gönderir
router.post('/', authenticate, authorize('SOFOR'), submitLocation);

// Herkes son konumu görebilir (ama yetkiye göre filtreleme yapılabilir)
router.get('/sofor/:soforId', authenticate, getLastLocation);

export default router;