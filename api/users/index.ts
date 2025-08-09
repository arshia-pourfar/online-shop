import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM "User"');
      return res.json(result.rows);
    } catch (error) {
      console.error('[getAllUsers]', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, password, phone, status, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const emailCheck = await pool.query('SELECT id FROM "User" WHERE email=$1', [email]);
      if (emailCheck.rowCount && emailCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Email already in use by another user.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = `
        INSERT INTO "User" (name, email, password, phone, status, role)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
      const result = await pool.query(insertQuery, [name, email, hashedPassword, phone, status, role]);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('[createUser]', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
