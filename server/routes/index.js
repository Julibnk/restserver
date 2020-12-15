
const express = require('express');

const app = express();

// Añade las rutas de usuario
app.use(require('./usuario'));
// Añade las rutas de usuario
app.use(require('./login'));

// Añade las rutas de categorias
app.use(require('./categoria'));

// Añade las rutas de productos
app.use(require('./producto'));

// Añade las rutas de subidas
app.use(require('./upload'));

// Añade las rutas de subidas
app.use(require('./imagenes'));

module.exports = app;
