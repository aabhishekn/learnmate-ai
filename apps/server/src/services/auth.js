import bcrypt from 'bcrypt';
import User from '../models/User.js';

export async function createUser({ email, name, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, name, passwordHash });
  await user.save();
  return user;
}

export async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
