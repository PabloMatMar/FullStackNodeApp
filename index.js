require('dotenv').config();
const {SECRET, BASE_URL, CLIENT_ID, ISSUER} = process.env

const express = require('express');
const path = require('path');
require('./utils/mongoBase');
require('./utils/pg_pool');
const { auth } = require('express-openid-connect');


const Config = {
    authRequired: false,
    auth0Logout: true,
    secret: SECRET,
    baseURL: BASE_URL,
    clientID: CLIENT_ID,
    issuerBaseURL: ISSUER
};

//Exportacion de las rutas
const adminRoutes = require('./routes/moviesAdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favMoviesRoutes = require('./routes/favMoviesRoutes');

const app = express();
const port = 3000;

// TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// MIDDLEWARES
app.use(express.json()); // Habilitar tipo de dato a recibir
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(auth(Config));
const check = require('./middleware/checkAuth');
const roles = require('./middleware/checkAdmin');


//RUTAS:

//Ruta home para logearse o crear usuario/admin:
app.use('/', homeRoutes);
//Rutas del dashboard para ir hacia lado usuario o lado administrador:
app.use('/dashboard', check.isAuth, roles.isAdmin, dashboardRoutes);
//Rutas para usuario:
app.use('/search', check.isAuth, searchRoutes);
//Rutas para administrador:
app.use('/movies', check.isAuth, adminRoutes);

app.use('/favmovies', check.isAuth, favMoviesRoutes);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})