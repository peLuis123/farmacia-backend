const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
/**
 * @swagger
 * /v1/comentarios/addcomment:
 *   post:
 *     summary: Agregar un comentario
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               user:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profile:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             required: [userId, user, email, profile, rating, comment]
 *     responses:
 *       '201':
 *         description: Comentario guardado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Comentario guardado exitosamente
 *               commentId: <aqui_va_el_commentId>
 *       '400':
 *         description: Todos los campos son obligatorios
 *       '500':
 *         description: Error al guardar el comentario
 * /v1/comentarios/getcomments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     responses:
 *       '200':
 *         description: Comentarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - { id: 'commentId1', userId: 'userId1', user: 'user1', email: 'user1@example.com', profile: 'profile1', rating: 5, comment: 'Comentario 1' }
 *               - { id: 'commentId2', userId: 'userId2', user: 'user2', email: 'user2@example.com', profile: 'profile2', rating: 4, comment: 'Comentario 2' }
 *       '500':
 *         description: Error al procesar la solicitud
 *         content:
 *           application/json:
 *             example:
 *               message: Error al obtener los comentarios
 * /v1/comentarios/editcomment/{id}:
 *   put:
 *     summary: Actualizar un comentario
 *     tags: [Comentarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               user:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profile:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *             required: [userId, user, email, profile, rating, comment]
 *     responses:
 *       '200':
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Comentario actualizado exitosamente
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: Error al actualizar el comentario
 * /v1/comentarios/deletecomment/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comentarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: Comentario eliminado exitosamente
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: Error al eliminar el comentario
 */

router.post('/addcomment', async (req, res) => {
    try {
        const { userId, user, email, profile, rating, comment } = req.body;
        if (!userId || !user || !email || !profile || !rating || !comment) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const db = admin.database();
        const commentsRef = db.ref('comentarios');
        const newCommentRef = commentsRef.push();
        const newCommentId = newCommentRef.key;
        const newCommentData = {
            userId: userId,
            user: user,
            email: email,
            profile: profile,
            rating: rating,
            comment: comment
        };
        newCommentRef.set(newCommentData)
            .then(() => {
                res.status(201).json({ message: 'Comentario guardado exitosamente', commentId: newCommentId });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al guardar el comentario', error });
            });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

router.get('/getcomments', async (req, res) => {
    try {
        const db = admin.database();
        const commentsRef = db.ref('comentarios');
        const snapshot = await commentsRef.once('value');
        const allComments = [];

        snapshot.forEach(commentSnapshot => {
            const commentData = commentSnapshot.val();
            const commentWithId = { id: commentSnapshot.key, ...commentData };
            allComments.push(commentWithId);
        });

        res.status(200).json(allComments);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

router.put('/editcomment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, user, email, profile, rating, comment } = req.body;

        const db = admin.database();
        const commentsRef = db.ref('comentarios').child(id);

        const updatedCommentData = {
            userId: userId,
            user: user,
            email: email,
            profile: profile,
            rating: rating,
            comment: comment
        };

        commentsRef.update(updatedCommentData)
            .then(() => {
                res.status(200).json({ message: 'Comentario actualizado exitosamente' });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al actualizar el comentario', error });
            });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

router.delete('/deletecomment/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const db = admin.database();
        const commentsRef = db.ref('comentarios').child(id);

        commentsRef.remove()
            .then(() => {
                res.status(200).json({ message: 'Comentario eliminado exitosamente' });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al eliminar el comentario', error });
            });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

module.exports = router;
