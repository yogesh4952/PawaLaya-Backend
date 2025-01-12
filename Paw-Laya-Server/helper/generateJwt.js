import jwt from 'jsonwebtoken';

const generateJwt = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    username: user.username,
    email: user.email,
  };

  // Check if the SECRET_STRING is present
  if (!process.env.SECRET_STRING) {
    throw new Error(
      'SECRET_STRING is not defined in the environment variables.'
    );
  }

  return jwt.sign(payload, process.env.SECRET_STRING, {
    expiresIn: '24h',
  });
};

export default generateJwt;
