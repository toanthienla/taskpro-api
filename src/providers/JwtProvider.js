import JWT from 'jsonwebtoken';

const generateToken = async (userInfo, privateKey, tokenLife) => {
  try {
    return JWT.sign(userInfo, privateKey, { algorithm: 'HS256', expiresIn: tokenLife });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = async (token, privateKey) => {
  try {
    return JWT.verify(token, privateKey);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken
};