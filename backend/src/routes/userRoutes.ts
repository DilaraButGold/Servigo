import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/users', authenticate, authorize('ADMIN'), async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
});

export default router;