export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ message: 'Validation failed.', errors: Object.values(error.errors).map((item) => item.message) });
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that value already exists.' });
  res.status(error.statusCode || 500).json({ message: error.message || 'An unexpected server error occurred.' });
}
