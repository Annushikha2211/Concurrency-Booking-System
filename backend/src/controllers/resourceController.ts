import { Response } from 'express';
import { Resource } from '../models/Resource.js';
import { AuthRequest } from '../middlewares/auth.js';

// 1. Create Resource (Admin Only)
export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, category, location, capacity, pricePerHour } = req.body;

    if (!name || !category || !pricePerHour) {
      res.status(400).json({ message: 'Name ,category and pricePerhour is mandatory' });
      return;
    }

    const resource = await Resource.create({
      name,
      description,
      category,
      location,
      capacity,
      pricePerHour,
    });

    res.status(201).json({
      message: 'Resource  created successfully',
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during resource creation', error: (error as Error).message });
  }
};

// 2. Get All Resources (Public)
export const getAllResources = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resources = await Resource.find({ isActive: true });
    res.status(200).json({ count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching resources', error: (error as Error).message });
  }
};