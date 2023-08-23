const express = require('express');
const admin = require('firebase-admin');
const upload = require('../middlewares/fileUpload');
const router = express.Router();


router.post('/addperson', upload.single('image'), async (req, res) => {
  try {
    const { name, area, description } = req.body;
    if (!name || !area || !description) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const db = admin.database();
    const personalRef = db.ref('personal');

    const imageUrl = `uploads/${req.file.filename}`;

    const newData = {
      name: name,
      area: area,
      description: description,
      image: imageUrl
    };

    const newPersonalRef = personalRef.push();
    newPersonalRef.set(newData)
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
router.put('/editperson/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, area, description } = req.body;

        const db = admin.database();
        const personalRef = db.ref('personal').child(id);

        const imageUrl = `uploads/${req.file.filename}`;

        const updatedData = {
            name: name,
            area: area,
            description: description,
            image: imageUrl
        };

        personalRef.update(updatedData)
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
router.get('/allpersons', async (req, res) => {
    try {
        const db = admin.database();
        const personalRef = db.ref('personal');
        const snapshot = await personalRef.once('value');
        const allPersons = [];

        snapshot.forEach(personSnapshot => {
            const personData = personSnapshot.val();
            const personWithId = { id: personSnapshot.key, ...personData };
            allPersons.push(personWithId);
        });

        res.status(200).json(allPersons);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

router.delete('/deleteperson/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const db = admin.database();
        const personalRef = db.ref('personal').child(id);

        personalRef.remove()
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
