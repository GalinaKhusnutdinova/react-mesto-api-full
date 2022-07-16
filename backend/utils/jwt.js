const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// const SECRET_KEY = 'very_secret';

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { generateToken, checkToken };
