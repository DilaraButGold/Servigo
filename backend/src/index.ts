import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import devamsizlikRoutes from './routes/devamsizlıkRoutes'; // dosya adını düzelttim (türkçe karakter yok)
import konumRoutes from './routes/konumRoutes';
import odemeRoutes from './routes/odemeRoutes';
import yoklamaRoutes from './routes/yoklamaRoutes'; // YENİ
import { authenticate, authorize, AuthRequest } from './middleware/auth';
import { startPaymentCron } from './Jobs/paymentReminder'; // klasör adını küçük harf yaptım

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Yeni istemci bağlandı:', socket.id);
    socket.on('register', (data) => {
        const { role, id } = data;
        if (role === 'SOFOR' && id) {
            socket.join(`sofor_${id}`);
            console.log(`Şoför ${id} odasına katıldı`);
        }
        if (role === 'VELI' && id) {
            socket.join(`veli_${id}`);
            console.log(`Veli ${id} odasına katıldı`);
        }
    });
    socket.on('disconnect', () => {
        console.log('İstemci ayrıldı:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Servigo API is running 🚐' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devamsizlik', devamsizlikRoutes);
app.use('/api/konum', konumRoutes);
app.use('/api/odeme', odemeRoutes);
app.use('/api/yoklama', yoklamaRoutes); // YENİ

app.get('/api/profile', authenticate, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

app.get('/api/admin-only', authenticate, authorize('ADMIN'), (req: AuthRequest, res) => {
    res.json({ message: 'Admin erişimi başarılı', user: req.user });
});

app.set('io', io);

startPaymentCron();

server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Socket.io ready`);
});