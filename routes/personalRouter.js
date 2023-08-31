const express = require('express');
const admin = require('firebase-admin');
const upload = require('../middlewares/fileUpload');
const router = express.Router();

/**
 * @swagger
 * /v1/personal/addperson:
 *   post:
 *     summary: Agregar información de personal
 *     tags: [Personal]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               area:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required: [name, area, description, image]
 *     responses:
 *       '201':
 *         description: Personal añadido exitosamente
 *       '400':
 *         description: Solicitud incorrecta
 *       '500':
 *         description: Error interno del servidor
 * /v1/personal/editperson/{id}:
 *   put:
 *     summary: Actualizar información de personal
 *     tags: [Personal]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               area:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required: [name, area, description, image]
 *     responses:
 *       '200':
 *         description: Personal actualizado exitosamente
 *       '500':
 *         description: Error interno del servidor
 * /v1/personal/allpersons:
 *   get:
 *     summary: Obtener información de todo el personal
 *     tags: [Personal]
 *     responses:
 *       '200':
 *         description: Información de todo el personal obtenida exitosamente
 *       '500':
 *         description: Error interno del servidor
 * /v1/personal/deleteperson/{id}:
 *   delete:
 *     summary: Eliminar información de personal
 *     tags: [Personal]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Registro eliminado exitosamente
 *       '500':
 *         description: Error interno del servidor
 */
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
        res.status(201).json({ message: 'personal añadido exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al nuevo personal', error });
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
                res.status(200).json({ message: 'se actualizo exitosamente' });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al actualizar los datos', error });
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
