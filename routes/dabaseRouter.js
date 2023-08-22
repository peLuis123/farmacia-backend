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
router.post('/data', (req, res) => {
    const db = admin.database();
    const personalRef = db.ref('personal');

    const newData = {
      name: 'Alex Johnson',
      category: 'Culinary Arts',
      description: 'Executive chef known for creating innovative and delicious dishes.',
      image: 'https://laborex.smartdemowp.com/wp-content/uploads/2021/05/team-1.jpg'
    };
    const newPersonalRef = personalRef.push();
    newPersonalRef.set(newData)
      .then(() => {
        res.status(201).json({ message: 'Datos guardados exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al guardar los datos', error });
      });
  });

module.exports = router;
