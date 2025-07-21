"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
// گرفتن همه دسته‌بندی‌ها
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma_1.default.category.findMany();
        res.json(categories);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getAllCategories]', err.message);
        }
        res.status(500).json({ error: 'Failed to get categories' });
    }
});
exports.getCategories = getCategories;
// ساخت دسته‌بندی جدید
// export const createCategory = async (req: Request, res: Response) => {
//     const { name } = req.body;
//     if (typeof name !== 'string') {
//         return res.status(400).json({ error: 'Invalid category name' });
//     }
//     try {
//         const newCategory = await prisma.category.create({
//             data: { name },
//         });
//         res.status(201).json(newCategory);
//     } catch (err: unknown) {
//         if (err instanceof Error) {
//             console.error('[createCategory]', err.message);
//         }
//         res.status(500).json({ error: 'Failed to create category' });
//     }
// };
