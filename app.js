require('dotenv').config()

const express = require('express');
const path = require('path');
const logger = require('morgan');

const sequelize = require('./util/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const flash = require('connect-flash');
const authRouter = require('./routes/authRoute');
const User = require('./models/userModel');

const app = express();

const corsOptions = {
    origin: "http://192.168.1.19:8080",
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['set-cookie']
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new SequelizeStore({
            db: sequelize,
        }),
        resave: false,
        proxy: true,
        saveUninitialized: false,
        unset: 'destroy'
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findOne({where: {id: req.session.user.id}})
        .then(user => {
            req.user = user;
            console.log("req.user : ",req.user);
            next();
        })
        .catch(err => console.log(err));
});

app.use(flash());
app.use('/', cors(corsOptions), authRouter);

sequelize.sync().then(response => {
  app.listen(3000);
}).catch(err => console.error(err));

module.exports = app;
