const express = require('express');
const admin = require('firebase-admin');
const upload = require('../middlewares/fileUpload');
const router = express.Router();
/**
 * @swagger
 * /v1/services/addservice:
 *   post:
 *     summary: Agregar información de servicio
 *     tags: [Servicios]
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
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *             required: [name, category, description, price, image]
 *     responses:
 *       '201':
 *         description: servicio guardado exitosamente
 *
 *       '400':
 *         description: Solicitud incorrecta ('Todos los campos son obligatorios')
 *       '500':
 *         description: Error al guardar los datos

 * /v1/services/editservice/{id}:
 *   put:
 *     summary: Actualizar información de servicio
 *     tags: [Servicios]
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
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *             required: [name, category, description, price, image]
 *     responses:
 *       '200':
 *         description: Servicio actualizado correctamente
 *       '500':
 *         description: Error al actualizar los datos
 * /v1/services/allservices:
 *   get:
 *     summary: Obtener información de todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       '200':
 *         description: Información de todos los servicios obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Servicio 1
 *                 category: Categoría A
 *                 description: Descripción del servicio 1
 *                 price: 100
 *                 image: url_de_la_imagen
 *               - id: 2
 *                 name: Servicio 2
 *                 category: Categoría B
 *                 description: Descripción del servicio 2
 *                 price: 150
 *                 image: url_de_la_imagen
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: Error al obtener la información de los servicios
 * /v1/services/deleteservice/{id}:
 *   delete:
 *     summary: Eliminar información de servicio
 *     tags: [Servicios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Registro eliminado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Registro eliminado exitosamente
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: Error al eliminar el registro
 */

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
        res.status(201).json({ message: 'servicio guardado exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al guardar el servicio', error });
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
        res.status(200).json({ message: 'servicio actualizados exitosamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al actualizar el servicio', error });
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
