const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.authToken;

  if (!token || typeof token !== 'string') {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized! Login Agains' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.SECRET_STRING);
    // console.log(`tokenDecode: ${tokenDecode.jwtPaylo._id} `)
    console.log('tokenDecode:', tokenDecode);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: 'Not authorized. Login Again',
      });
    }
    next();
  } catch (err) {
    return res.json({
      success: false,
      text: 'middleware wala',
      message: err.message,
    });
  }
};

module.exports = userAuth;
