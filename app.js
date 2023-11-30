const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6563b205a5d6f1b426304fa6',
  };

  next();
});

app.use('/', userRouter);

app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log(`app listlllllening on port ${PORT}`);
});
