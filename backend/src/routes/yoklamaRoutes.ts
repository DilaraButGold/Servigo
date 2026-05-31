import { Router } from 'express';
import { submitAttendance, getMyStudentAttendance, getStudentQR } from '../controllers/yoklamaController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('SOFOR'), submitAttendance);
router.get('/me', authenticate, authorize('VELI'), getMyStudentAttendance);
router.get('/qr/:ogrenciId', authenticate, authorize('VELI', 'SOFOR'), getStudentQR);

export default router;