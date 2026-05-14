import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as veliController from '../controllers/veliController';
import * as soforController from '../controllers/soforController';
import * as ogretmenController from '../controllers/ogretmenController';
import * as ogrenciController from '../controllers/ogrenciController';

const router = Router();
router.use(authenticate, authorize('ADMIN')); // Tüm route'lar admin gerektirir

// Veli routes
router.get('/veliler', veliController.getAllVelis);
router.get('/veli/:id', veliController.getVeliById);
router.post('/veli', veliController.createVeli);
router.put('/veli/:id', veliController.updateVeli);
router.delete('/veli/:id', veliController.deleteVeli);

// Şoför routes
router.get('/soforler', soforController.getAllSofors);
router.get('/sofor/:id', soforController.getSoforById);
router.post('/sofor', soforController.createSofor);
router.put('/sofor/:id', soforController.updateSofor);
router.delete('/sofor/:id', soforController.deleteSofor);

// Öğretmen routes
router.get('/ogretmenler', ogretmenController.getAllOgretmen);
router.get('/ogretmen/:id', ogretmenController.getOgretmenById);
router.post('/ogretmen', ogretmenController.createOgretmen);
router.put('/ogretmen/:id', ogretmenController.updateOgretmen);
router.delete('/ogretmen/:id', ogretmenController.deleteOgretmen);

// Öğrenci routes
router.get('/ogrenciler', ogrenciController.getAllOgrenciler);
router.get('/ogrenci/:id', ogrenciController.getOgrenciById);
router.post('/ogrenci', ogrenciController.createOgrenci);
router.put('/ogrenci/:id', ogrenciController.updateOgrenci);
router.delete('/ogrenci/:id', ogrenciController.deleteOgrenci);

export default router;