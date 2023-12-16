const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { PORT, MONGO_URL, allowedCors } = require('./config');

const { createUserValidator, loginValidator } = require('./middlewares/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes');

const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');

const app = express();

app.use(cors({ origin: allowedCors }));

mongoose.connect(MONGO_URL, { family: 4 });

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidator, login);

app.post('/signup', createUserValidator, createUser);

app.use('/', router);

app.use((req, res, next) => {
  const e = new NotFoundError('Страница не найдена');
  next(e);
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
