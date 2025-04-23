const Usuario = require('../models/usuario');

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.login = (req, res) => {
  const { usuario, contraseña } = req.body;

  Usuario.findByUsuario(usuario, (err, results) => {
    if (err) return res.send('Error en la base de datos');
    
    const user = results[0];
    if (user && user.contraseña === contraseña) {
      req.session.usuario = user;
      return res.redirect('/retirar');
    } else {
      return res.send('Credenciales incorrectas');
    }
  });
};
