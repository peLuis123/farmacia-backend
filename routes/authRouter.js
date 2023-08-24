const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = express.Router();
const admin = require('firebase-admin');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const jwtSecret = process.env.JWT_SECRET;
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = require('../middlewares/fileUpload');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y registro de usuarios
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - role
 *         - name
 *         - email
 *         - password
 *       properties:
 *         role:
 *           type: string
 *           description: Rol del usuario (admin, user)
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         role: user
 *         name: Usuario
 *         email: pedrorc2018@correo.com
 *         password: clave123
 *
 */



router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const {  role, name, email, password } = req.body;
    // const role ="user"
    console.log(req.body);
    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    const db = admin.firestore();
    const userDocRef = db.collection('users').doc(userRecord.uid);

    const avatarUrl = `uploads/${req.file.filename}`;
    console.log(avatarUrl);
    await userDocRef.set({
      role: role,
      name: name,
      email: email,
      profile: avatarUrl,
    });

    console.log('Usuario registrado:', userRecord.uid);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

  router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('Datos de inicio de sesión incompletos');
            return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios' });
        }
        const user = await admin.auth().getUserByEmail(email);
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        const jwtPayload = {
            uid: user.uid,
            email: user.email,
            name: userData.name,
            role: userData.role,
            profile: userData.profile
        };
        const token = jwt.sign(jwtPayload, jwtSecret);

        console.log('Inicio de sesión exitoso:', user.uid);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: token, });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(401).json({ message: 'Credenciales inválidas', error });
    }
});




module.exports = router;
