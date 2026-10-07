import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

// 1. SIGNUP API
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'fill all the fields'})
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'user already registered' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      message: 'User successfully registered',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during signup', error: (error as Error).message });
  }
};

// 2. LOGIN API
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email or password is missing' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during login', error: (error as Error).message });
  }
};