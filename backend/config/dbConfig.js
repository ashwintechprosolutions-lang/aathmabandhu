// Was hardcoded to a public IP + the literal password "postgres". Every value now
// comes from the environment (see .env.example / docker-compose.yml) - there is no
// fallback to the old values on purpose, so a missing var fails loudly at startup
// instead of silently reusing an insecure default.
require('dotenv').config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name} (see .env.example)`);
  return v;
}

module.exports = {
  HOST: required('DB_HOST'),
  USER: required('DB_USER'),
  PASSWORD: required('DB_PASSWORD'),
  DB: required('DB_NAME'),
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
