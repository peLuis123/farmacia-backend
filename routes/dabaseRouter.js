const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.get('/check-connection', (req, res) => {
  const db = admin.database();
  const ref = db.ref('/');
  ref.once('value')
    .then(() => {
      res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
    })
    .catch(error => {
      res.status(500).json({ message: 'Error de conexión a la base de datos', error });
    });
});
module.exports = router;
