
const express = require('express');

const app = express();

// Añade las rutas de usuario
app.use(require('./usuario'));
// Añade las rutas de usuario
app.use(require('./login'));

module.exports = app;
