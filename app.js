const express = require('express'); //Llamamos a express
const cors = require('cors');

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

//Endpoints
app.use('/api/v1/users', usersRouter); //llamando a users
app.use('/api/v1/repairs', repairsRouter)
//aquí definimos el endpoint

app.use('*', globalErrorHandler);

module.exports = { app };

