export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const payload = { success: false, error: err.message || 'Internal Server Error' };
  if (err.code) payload.code = err.code;
  res.status(status).json(payload);
}
