function checkAuth(req, res, next) {
  if (req.session && req.session.user) {
    next(); // user is authenticated
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export default checkAuth;
