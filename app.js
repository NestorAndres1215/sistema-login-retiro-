const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Configuración de sesiones
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Usar rutas
app.use(authRoutes);
app.use(transactionRoutes);

// Arrancar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
