// The JWT signing secret, shared by authController.js and jwtMiddleWare.js. Was
// hardcoded and duplicated in both files. Must be set via env var - generate one
// with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing required env var JWT_SECRET (see .env.example)');
}

module.exports = { JWT_SECRET };
