const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.json({
      message: 'Access forbidden. Admins only',
    });
  }
  next();
};

const authorizeUser = (req, res, next) => {
  console.log(req.body);
  if (req.user.role !== 'user') {
    res.json({
      message: 'Access forbidden, Users only',
    });
  }
  next();
};

export { authorizeAdmin, authorizeUser };
