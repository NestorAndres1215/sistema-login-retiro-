const db = require('../config/db');

const Usuario = {
  findByUsuario: (usuario, callback) => {
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], callback);
  },

  updateSaldo: (id, saldo, callback) => {
    db.query('UPDATE usuarios SET saldo = ? WHERE id = ?', [saldo, id], callback);
  }
};

module.exports = Usuario;
