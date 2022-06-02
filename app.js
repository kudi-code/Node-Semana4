const express = require('express'); //Llamamos a express
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');

//Routers
const { usersRouter } = require('./routes/users.routes'); //Importamos users
const { repairsRouter } = require('./routes/repairs.routes');

const app = express(); //guardamos en app el express

// Enable CORS
app.use(cors());

//Enable incoming JSON data
app.use(express.json());

// Enable incoming Form-Data
app.use(express.urlencoded({ extended: true }));

// Set pug as template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());

// Log incoming requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

// Limit IP requests
const limiter = rateLimit({
    max: 10000,
    windowMs: 1 * 60 * 60 * 1000, // 1 hr
    message: 'Too many requests from this IP',
  });

app.use(limiter);

//Endpoints
app.use('/api/v1/users', usersRouter); //llamando a users
app.use('/api/v1/repairs', repairsRouter)
//aquí definimos el endpoint

app.use('*', globalErrorHandler);

module.exports = { app };

