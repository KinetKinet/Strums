import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

function isValidPassword(input, expected) {
  if (!expected) return false;

  if (expected.startsWith('$2a$') || expected.startsWith('$2b$') || expected.startsWith('$2y$')) {
    return bcrypt.compareSync(input, expected);
  }

  return input === expected;
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET is not configured' });
  }

  if (username !== adminUser || !isValidPassword(password || '', adminPassword)) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { role: 'admin', username: adminUser },
    jwtSecret,
    { expiresIn: '12h' }
  );

  return res.json({ token });
});

export default router;
