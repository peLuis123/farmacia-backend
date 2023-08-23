const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();


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

      res.status(201).json({ message: 'Área de servicios agregada exitosamente', id: result.id });
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
