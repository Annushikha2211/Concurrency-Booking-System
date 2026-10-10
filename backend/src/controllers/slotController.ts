import { Response } from 'express';
import { Slot } from '../models/Slot.js';
import { Resource } from '../models/Resource.js';
import { AuthRequest } from '../middlewares/auth.js';

// 1. Generate Slots (Admin Only)
export const generateSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resourceId, date, startTime, endTime, durationMinutes = 60 } = req.body;

    if (!resourceId || !date || !startTime || !endTime) {
      res.status(400).json({ message: 'Sabhi required fields (resourceId, date, startTime, endTime) zaroori hain' });
      return;
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      res.status(404).json({ message: 'Resource nahi mila' });
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    if (startDateTime >= endDateTime) {
      res.status(400).json({ message: 'Start time end time se pehle honi chahiye' });
      return;
    }

    let currentStart = new Date(startDateTime);
    const slotsToCreate = [];

    while (currentStart < endDateTime) {
      const currentEnd = new Date(currentStart.getTime() + durationMinutes * 60000);
      if (currentEnd > endDateTime) break;

      slotsToCreate.push({
        resourceId,
        startTime: new Date(currentStart),
        endTime: new Date(currentEnd),
        price: resource.pricePerHour * (durationMinutes / 60),
        status: 'available',
        isBooked: false,
      });

      currentStart = currentEnd;
    }

    try {
      await Slot.insertMany(slotsToCreate, { ordered: false });
    } catch (err: any) {
      // Duplicate unique index errors ignore honge agar slots pehle se exist karte hain
    }

    res.status(201).json({
      message: 'Slots successfully generate ho gaye hain',
      count: slotsToCreate.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during slot generation', error: (error as Error).message });
  }
};

// 2. Get Available Slots for a Resource (Public)
export const getResourceSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.params;
    const slots = await Slot.find({ resourceId, isBooked: false });
    res.status(200).json({ count: slots.length, slots });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching slots', error: (error as Error).message });
  }
};