import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { authenticate, authorize, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Servigo API is running 🚐' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (örnek)
app.get('/api/profile', authenticate, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

app.get('/api/admin-only', authenticate, authorize('ADMIN'), (req: AuthRequest, res) => {
    res.json({ message: 'Admin erişimi başarılı', user: req.user });
});

// Admin user routes
app.use('/api/admin', authenticate, authorize('ADMIN'), userRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});