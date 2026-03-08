import jwt from 'jsonwebtoken';

export default function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing admin token' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret);

    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = payload;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
}
