import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'ایمیل یا رمز عبور نادرست است' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined!');
            return res.status(500).json({ error: 'خطای سرور: JWT_SECRET تعریف نشده' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, secret, { expiresIn: '7d' });

        res.json({
            message: 'ورود موفق',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'خطای سرور هنگام ورود' });
    }
};


// // src/controllers/auth.ts
// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import prisma from '../../prisma/prisma';
// import dotenv from 'dotenv';

// dotenv.config();

// export const loginUser = async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     try {
//         const user = await prisma.user.findUnique({ where: { email } });

//         if (!user || user.password !== password) {
//             return res.status(401).json({ error: 'ایمیل یا رمز عبور نادرست است' });
//         }

//         const token = jwt.sign(
//             { id: user.id, role: user.role, name: user.name },
//             process.env.JWT_SECRET!,
//             { expiresIn: '7d' }
//         );

//         res.json({
//             message: 'ورود موفق',
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error('Login Error:', err);
//         res.status(500).json({ error: 'خطای سرور هنگام ورود' });
//     }
// };

