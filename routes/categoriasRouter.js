const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

/**
 * @swagger
 * /v1/categorias/addservicios:
 *   post:
 *     summary: Agregar categoria de servicios
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               servicios:
 *                type: string
 *                description: aqui bah el nombre del servicio
 *                required: [servicios]
 *     responses:
 *       '201':
 *         description: Área de servicios agregada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: servicios agregados exitosamente
 *               id: <aqui_va_el_id>
 *       '400':
 *         description: Todos los campos son obligatorios
 *       '500':
 *         description: Error al procesar la solicitud
 * /v1/categorias/addareas:
 *   post:
 *     summary: Agregar un área
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *             required: [area]
 *     responses:
 *       '201':
 *         description: Área agregada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Área agregada exitosamente
 *               id: <aqui_va_el_id>
 *       '400':
 *         description: todos los campos son obligatorios
 *       '500':
 *         description: Error al procesar la solicitud
 * /v1/categorias/allareas:
 *   get:
 *     summary: Obtener todas las áreas
 *     tags: [Categoria]
 *     responses:
 *       '200':
 *         description: Áreas obtenidas exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - área1
 *               - área2
 *       '500':
 *         description: Error al obtener las áreas
 * /v1/categorias/allservices:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Categoria]
 *     responses:
 *       '200':
 *         description: Servicios obtenidos exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - servicio1
 *               - servicio2
 *       '500':
 *         description: Error al procesar la solicitud
 *
 *
 */
router.post('/addservicios', async (req, res) => {
  try {
    const { servicios } = req.body;
    if (!servicios) {
      return res.status(400).json({ message: 'El campo de área es obligatorio' });
    }

    const db = admin.firestore();
    const serviciosCollection = db.collection('servicios');

    const newSpecialization = {
      servicios: servicios
    };

    const result = await serviciosCollection.add(newSpecialization);

    res.status(201).json({ message: 'servicios agregado exitosamente', id: result.id });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});
router.post('/addareas', async (req, res) => {
  try {
    const { area } = req.body;
    if (!area) {
      return res.status(400).json({ message: 'El campo de área es obligatorio' });
    }

    const db = admin.firestore();
    const areasCollection = db.collection('area');

    const newArea = {
      area: area
    };

    const result = await areasCollection.add(newArea);

    res.status(201).json({ message: 'Área agregada exitosamente', id: result.id });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});
router.get('/allareas', async (req, res) => {
  try {
    const areasSnapshot = await admin.firestore().collection('area').get();
    const areas = areasSnapshot.docs.map(doc => doc.data().area);
    res.status(200).json(areas);
  } catch (error) {
    console.error('Error al obtener las áreas:', error);
    res.status(500).json({ message: 'Error al obtener las áreas' });
  }
});

router.get('/allservices', async (req, res) => {
  try {
    const servicesSnapshot = await admin.firestore().collection('servicios').get();
    const services = servicesSnapshot.docs.flatMap(doc => doc.data().servicios);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ message: 'Error al obtener los servicios' });
  }
});
module.exports = router;
