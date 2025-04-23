const db = require('../config/db');

const Transaccion = {
  crear: (usuario_id, monto, metodo_pago, callback) => {
    db.query('INSERT INTO transacciones (usuario_id, monto, metodo_pago) VALUES (?, ?, ?)', 
    [usuario_id, monto, metodo_pago], callback);
  }
};

module.exports = Transaccion;
