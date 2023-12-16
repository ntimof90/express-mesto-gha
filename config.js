require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
  JWT_SECRET = 'dev-secret',
} = process.env;
const allowedCors = [
  'https://coast.students.nomoredomainsmonster.ru',
  'http://coast.students.nomoredomainsmonster.ru',
  'http://localhost:3000',
];
module.exports = {
  PORT,
  MONGO_URL,
  JWT_SECRET,
  allowedCors,
};
