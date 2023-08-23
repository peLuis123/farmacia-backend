const express = require('express');
const admin = require('firebase-admin');
const upload = require('../middlewares/fileUpload');
const router = express.Router();

router.post('/addservice', upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price } = req.body;
    if (!name || !category || !description || !price) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const db = admin.database();
    const servicesRef = db.ref('services');

    const imageUrl = `uploads/${req.file.filename}`;

    const newData = {
      name: name,
      category: category,
      description: description,
      price: price,
      image: imageUrl
    };

    const newServiceRef = servicesRef.push();
    newServiceRef.set(newData)
      .then(() => {
        res.status(201).json({ message: 'Datos y ruta de imagen guardados exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al guardar los datos y ruta de imagen', error });
      });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

router.put('/editservice/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price } = req.body;

    const db = admin.database();
    const servicesRef = db.ref('services').child(id);

    const imageUrl = `uploads/${req.file.filename}`;

    const updatedData = {
      name: name,
      category: category,
      description: description,
      price: price,
      image: imageUrl
    };

    servicesRef.update(updatedData)
      .then(() => {
        res.status(200).json({ message: 'Datos y ruta de imagen actualizados exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al actualizar los datos y ruta de imagen', error });
      });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

router.get('/allservices', async (req, res) => {
  try {
    const db = admin.database();
    const servicesRef = db.ref('services');
    const snapshot = await servicesRef.once('value');
    const allServices = [];

    snapshot.forEach(serviceSnapshot => {
      const serviceData = serviceSnapshot.val();
      const serviceWithId = { id: serviceSnapshot.key, ...serviceData };
      allServices.push(serviceWithId);
    });

    res.status(200).json(allServices);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

router.delete('/deleteservice/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = admin.database();
    const servicesRef = db.ref('services').child(id);

    servicesRef.remove()
      .then(() => {
        res.status(200).json({ message: 'Registro eliminado exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al eliminar el registro', error });
      });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

module.exports = router;
