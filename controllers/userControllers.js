/**
 * @author Javier Fuertes, Gabriela García y Pablo Mateos 
 * @exports userControllers
 * @namespace userControllers
 */
const { title } = require('process');
const process = require('process');
const users = require('../models/users_sql')


/**
 * Description: This function save a favorite movie of user in the database.
 * @memberof userControllers
 * @method addFavorite
 * @async  
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @return {Object} - an object containing the scraped info.
 * @throws {Error} message with the error during save process.
 */
const addFavorite = async (req, res) => {
    let fav = req.body;
    const response = await users.addFavorite(fav);
    res.status(201).json({
        msg: response
    });
};



/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof userControllers
 * @method getFavorites
 * @async  
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @desc {Error} Obtain a user's favorites movies from both the API and MongoDB
 */

const getFavorites = async (req, res) => {
    let userData = req.oidc.user
    // console.log(userData)
    let userId = userData.sub
    console.log(userId)
    if (userId.startsWith('auth0|')) {
        console.log(userId.slice(userId.indexOf('|') + 1))
        userId = userId.slice(userId.indexOf('|') + 1)
    }
    // const padding = "        "
    // const padding2 = "    "
    // // console.log("Este es el console.log de userId:"+userId)
    // const userMoviesApi = await users.getFavorites(userId+padding);
    // const userMoviesMongo = await users.getFavorites(userId+padding2);
    const userMoviesApi = await users.getFavorites(userId);

    res.status(200).render("moviesUser", { favMoviesApi: userMoviesApi, userId });
};


const deleteFavoriteMovie = async (req, res) => {
    // let userData = req.oidc.user
    // console.log(userData)
    // let userId = userData.sub
    // console.log(userId)
    // if(userId.startsWith('auth0|')) {
    //    console.log( userId.slice(userId.indexOf('|')+1))
    //    userId = userId.slice(userId.indexOf('|')+1)
    // }

    const { user, title } = req.body
    console.log(req.body)

    console.log("Este es el console log del req.body en backend;", user, title)

    const answer = await users.deleteFavorite(user, title);
    if (answer.title !== undefined) {
        const msj = `Has eliminado la pelicula: ${answer.title} de la tabla de favoritos`;
        console.log("Respondiendo a la ruta DELETE FAV MOVIE")
        res.status(200).json({ "message": msj })
    } else {
        res.status(400).json({ msj: "La pelicula que quieres eliminar no existe" });
    }
};



module.exports = {
    addFavorite,
    getFavorites,
    deleteFavoriteMovie
}