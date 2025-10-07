import { createUser, authenticateUser } from '../services/auth.js';
import User from '../models/User.js';

export async function signUp(req, res, next) {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await createUser({ email, name, password });
    req.session.userId = user._id;
    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await authenticateUser({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.userId = user._id;
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
}

export function signOut(req, res) {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
}
