const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// ========== REGISTRO ==========
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Verificar si el email ya existe
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Rol solicitado o PATIENT por defecto
    const assignedRole = await Role.findOne({
      where: { name: role ? role.toUpperCase() : 'PATIENT' }
    });

    if (!assignedRole) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // Crear usuario
    const user = await User.create({
      fullName,
      email,
      password: hash,
      roleId: assignedRole.id
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: assignedRole.name
      }
    });

  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};


// ========== LOGIN ==========
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: { model: Role }
    });

    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, role: user.Role.name },
      process.env.JWT_SECRET || 'default-secret-key-change-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.Role.name
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el login' });
  }
};


// ========== ME (OBTENER USUARIO ACTUAL) ==========
const me = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.Role.name
      }
    });
  } catch (err) {
    console.error('Error en /me:', err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};


// ========== LOGOUT ==========
const logout = async (req, res) => {
  try {
    res.json({ message: 'Logout exitoso' });
  } catch (err) {
    console.error('Error en logout:', err);
    res.status(500).json({ message: 'Error en logout' });
  }
};


// EXPORTAR TODO
module.exports = { register, login, me, logout };
