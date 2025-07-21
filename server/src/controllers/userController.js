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
exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const getAllUsers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany();
        res.json(users);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getAllUsers]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getUserById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const newUser = yield prisma_1.default.user.create({
            data: { name, email, password, role },
        });
        res.status(201).json(newUser);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[createUser]', err.message);
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[deleteUser]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.deleteUser = deleteUser;
