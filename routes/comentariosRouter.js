const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

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
