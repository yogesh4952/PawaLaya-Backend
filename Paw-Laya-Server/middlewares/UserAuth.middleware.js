import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token || typeof token !== 'string') {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized! Login Again' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.SECRET_STRING);
    console.log('tokenDecode:', tokenDecode);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Login Again',
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default userAuth;
