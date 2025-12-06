const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key-change-in-production');

    const user = await User.findByPk(decoded.id, {
      include: { model: Role }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = {
      id: user.id,
      role: user.Role.name,
      fullName: user.fullName,
      email: user.email
    };

    next();
  } catch (err) {
    console.error('Error en authMiddleware:', err);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const requireRole = (roles = []) => {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos suficientes' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
