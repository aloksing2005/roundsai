const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    console.warn(`[Auth Check Failed] No token cookie present for path: ${req.path}`);
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
    console.error(`[Auth Check Failed] Token verification failed for path ${req.path}:`, err.message);

    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
}

module.exports = requireAuth;