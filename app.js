const express = require('express');

const mongoose = require('mongoose');

const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

app.use(express.json());

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

app.use('/', userRouter);

app.use('/', cardRouter);

app.use((req, res, next) => {
  const e = new NotFoundError('Страница не найдена');
  next(e);
});

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
