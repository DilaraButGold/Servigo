import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import devamsizlikRoutes from './routes/devamsizlıkRoutes';
import { authenticate, authorize, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Geliştirme aşamasında; production'da kısıtla
        methods: ["GET", "POST"]
    }
});

// Socket.io bağlantı yönetimi
io.on('connection', (socket) => {
    console.log('Yeni istemci bağlandı:', socket.id);

    // İstemci kendi rolünü ve ID'sini bildirebilir (ör: soforId)
    socket.on('register', (data) => {
        const { role, id } = data;
        if (role === 'SOFOR' && id) {
            socket.join(`sofor_${id}`);
            console.log(`Şoför ${id} odasına katıldı`);
        }
    });

    socket.on('disconnect', () => {
        console.log('İstemci ayrıldı:', socket.id);
    });
});

// Express middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Servigo API is running 🚐' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devamsizlik', devamsizlikRoutes); // yeni

// Protected example
app.get('/api/profile', authenticate, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

app.get('/api/admin-only', authenticate, authorize('ADMIN'), (req: AuthRequest, res) => {
    res.json({ message: 'Admin erişimi başarılı', user: req.user });
});

// Socket.io'yu route'lara eklemek için (isteğe bağlı)
app.set('io', io);

server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Socket.io ready`);
});