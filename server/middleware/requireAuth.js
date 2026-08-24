const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.doctor = decoded;

    return next();
  } catch (err) {
    console.error('Authentication error:', err.message);

    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
}

module.exports = requireAuth;