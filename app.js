const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const admin = require('firebase-admin');
const databaseRoutes = require('./routes/dabaseRouter');
const authRoutes = require('./routes/authRouter');
const personalRoutes = require('./routes/personalRouter');
const servicesRoutes = require('./routes/servicesRouter');
const categoriasRoutes = require('./routes/categoriasRouter');
const comentariosRoutes = require('./routes/comentariosRouter');
// const serviceAccount = require("./serviceAccountKey.json");
const firebaseConfig  = require('./firebaseConfig.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080'
  }));
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: "https://apidatos-default-rtdb.firebaseio.com"
  });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/v1', databaseRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/personal', personalRoutes);
app.use('/v1/services', servicesRoutes);
app.use('/v1/categorias', categoriasRoutes);
app.use('/v1/comentarios', comentariosRoutes);
app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
