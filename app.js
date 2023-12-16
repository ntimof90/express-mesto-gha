const express = require('express');

const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { PORT, MONGO_URL, allowedCors } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

const app = express();

app.use(cors({ origin: allowedCors }));

mongoose.connect(MONGO_URL, { family: 4 });

app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/^(http:\/\/|https:\/\/)(w{3}\.)?[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}\/?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*/i),
  }),
}), createUser);

app.use('/', router);

app.use((req, res, next) => {
  const e = new NotFoundError('Страница не найдена');
  next(e);
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = error;
  res.status(statusCode).send({ message: [statusCode, message].join(' - ') });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
