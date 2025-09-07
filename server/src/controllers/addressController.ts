import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';

export const createAddress = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { title, street, city, postalCode, country } = req.body;
  if (!title || !street || !city || !postalCode || !country) return res.status(400).json({ error: 'All fields required' });

  try {
    const address = await prisma.address.create({ data: { userId, title, street, city, postalCode, country } });
    res.status(201).json(address);
  } catch {
    res.status(500).json({ error: 'Failed to create address' });
  }
};

export const getUserAddresses = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { id: 'asc' } });
    res.json(addresses);
  } catch {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await prisma.address.update({ where: { id: parseInt(id) }, data: req.body });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update address' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.address.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// controllers/addressController.ts
export const getAddressById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch {
    res.status(500).json({ error: 'Failed to fetch address' });
  }
};
