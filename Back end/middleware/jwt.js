const jwt = require('jsonwebtoken');


const generateToken = (req, res, next) => {
  const user = req.body.email
  console.log(user);
  console.log(process.env.SECRET_KEY);
  const token = jwt.sign({ userId: user }, 'process.env.SECRET_KEY');
  console.log(token);
  res.cookie('token', token, { httpOnly: true });
  next()
};
const verifyToken = (req, res, next) => {
  console.log(req.cookie);
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return console.log('Unauthorized');
  }

  jwt.verify(token, 'process.env.SECRET_KEY', (err, decoded) => {
    console.log(decoded.userId);
    console.log(token);
    console.log(process.env.SECRET_KEY);
    if (err) {
      return console.log('invalid token');
    }

    const userId = decoded.userId;
    console.log(userId);
    next()
    console.log('Access granted');
  });
}
module.exports = {
  generateToken,
  verifyToken
}