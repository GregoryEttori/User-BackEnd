require('dotenv').config()

const express = require('express');
const path = require('path');
const logger = require('morgan');

const sequelize = require('./util/database');
const session = require('express-session');
const cors = require('cors');
const flash = require('connect-flash');
const authRouter = require('./routes/authRoute');

const app = express();

const corsOptions = {
    origin: "http://192.168.1.13:8080",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
);

app.use(flash());
app.use('/', cors(corsOptions), authRouter);

sequelize.sync().then(response => {
  app.listen(3000);
}).catch(err => console.error(err));

module.exports = app;
