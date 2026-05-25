import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as veliController from '../controllers/veliController';
import * as soforController from '../controllers/soforController';
import * as ogretmenController from '../controllers/ogretmenController';
import * as ogrenciController from '../controllers/ogrenciController';
import { setKmFiyat, getKmFiyat } from '../controllers/ucretController';

const router = Router();
router.use(authenticate, authorize('ADMIN'));

// Veli
router.get('/veliler', veliController.getAllVelis);
router.get('/veli/:id', veliController.getVeliById);
router.post('/veli', veliController.createVeli);
router.put('/veli/:id', veliController.updateVeli);
router.delete('/veli/:id', veliController.deleteVeli);

// Şoför
router.get('/soforler', soforController.getAllSofors);
router.get('/sofor/:id', soforController.getSoforById);
router.post('/sofor', soforController.createSofor);
router.put('/sofor/:id', soforController.updateSofor);
router.delete('/sofor/:id', soforController.deleteSofor);

// Öğretmen
router.get('/ogretmenler', ogretmenController.getAllOgretmen);
router.get('/ogretmen/:id', ogretmenController.getOgretmenById);
router.post('/ogretmen', ogretmenController.createOgretmen);
router.put('/ogretmen/:id', ogretmenController.updateOgretmen);
router.delete('/ogretmen/:id', ogretmenController.deleteOgretmen);

// Öğrenci
router.get('/ogrenciler', ogrenciController.getAllOgrenciler);
router.get('/ogrenci/:id', ogrenciController.getOgrenciById);
router.post('/ogrenci', ogrenciController.createOgrenci);
router.put('/ogrenci/:id', ogrenciController.updateOgrenci);
router.delete('/ogrenci/:id', ogrenciController.deleteOgrenci);

// Ücret kuralı (yeni)
router.post('/ucret-kurali', setKmFiyat);
router.get('/ucret-kurali', getKmFiyat);

export default router;