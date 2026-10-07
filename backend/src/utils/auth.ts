import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Password Hash karne ke liye
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 2. Login ke waqt Password Compare karne ke liye
export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

// 3. JWT Token Generate karne ke liye
export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '7d', // Token 7 din tak valid rahega
  });
};