/**
 * @author Pablo Mateos 
 * @version 2.0
 * @namespace users_sql 
 */
require('dotenv').config();
const { ADMIN_KEY } = process.env
const pool = require('../utils/pg_pool');
const queries = require('../queries/queriesUser');

/**
 * Description: This function adds the selected movie from the user's favorite list.
 * @memberof users_sql 
 * @method addFavorite
 * @async 
 * @param {Object} fav - The values of the favorite movie.
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.addFavorite - The query to add a favorite movie.
 * @throws {Error} message with the err during save process.
 */
const addFavorite = async (fav, emailFK) => {
    let client;
    try {
        const { title, year, director, genre, runtime, poster } = fav;
        client = await pool.connect();
        await client.query(queries.addFavorite, [title, year, director, genre, runtime, poster, emailFK]);
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release()
    };
};

/**
 * Description: This function get all favorites movies of user in the database.
 * @memberof users_sql 
 * @method getFavorites
 * @async 
 * @param {Object} fav - The values of the favorite movie.
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.getFavorites - The query to get all favorites movies of the emailFK user.
 * @return {Array} Each element of the array is an object with one of the favorites movies of the emailFK user.
 * @throws {Error} message with the err during save process.
 */

const getFavorites = async (emailFK) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getFavorites, [emailFK]);
        result = data.rows;
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

/**
 * Description: This function removes the selected movie from the user's favorite list.
 * @memberof users_sql 
 * @method deleteFavorite
 * @async 
 * @param {Object} title - The title of the favorite movie that removes.
 * @param {string} emailFK - The name of user that is a forenkey in SQL.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.deleteFavorite - The query that removes the movie whose title is the title value from the emailFK user's list.
 * @throws {Error} message with the err during save process.
 */

const deleteFavorite = async (emailFK, title) => {
    let client;
    try {
        client = await pool.connect();
        await client.query(queries.deleteFavorite, [emailFK, title]);
    }
    catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
};

/**
 * Description: This function create a user.
 * @memberof users_sql 
 * @method createUser
 * @async 
 * @param {Object} user - User name and password to create a user.
 * @property {string} user.emailSignup - User name to create a user.
 * @property {string} user.passwordSignup - password to create a user.
 * @property {string} user.admin - The code that allows the registration as admin
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.createUser - The query that create a user.
 * @property {string} err.detail - Error indicate the user already exist and forced returns 0.
 * @return {number} One if the create user was okey, else, 0.
 * @throws {Error} message with the err during save process.
 */

const createUser = async (user) => {
    let client, result;
    try {
        const { emailSignup, passwordSignup, admin } = user;
        client = await pool.connect();
        const data = await client.query(queries.createUser, [emailSignup, passwordSignup, admin]);
        result = data.rowCount;
    } catch (err) {
        if (err.detail != undefined && err.detail.endsWith('already exists.'))
            return 0;
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

/**
 * Description: This function validated the credentials in the login process.
 * @memberof users_sql 
 * @method validatedUser
 * @async 
 * @param {Object} user - Credentials to validate.
 * @property {string} user.emailSignup - User name to validate.
 * @property {string} user.passwordSignup - password to validate.
 * @property {string} user.admin - The code to validate the admin.
 * @const {Object} pool - Host, username, database and password of ElephantSQL.
 * @property {function} connect - Method to connect to sql server.
 * @property {function} release - Method to disconnect to sql server.
 * @const {Object} client - Conection to DB.
 * @property {function} query - Sql method that passes a query in the first argument and the query values ​​in the second.
 * @property {Object} queries.validated - The query that validated a credentials of user in the process of login.
 * @return {number} One if the create user was okey, else, 0.
 * @throws {Error} message with the err during save process.
 */

const validatedUser = async (user) => {
    let client;
    let result = {
        credential: 0,
        admin: false
    }
    try {
        const { email, password } = user;
        client = await pool.connect();
        const data = await client.query(queries.validatedUser, [email, password]);
        const checkAdmin = await client.query(queries.isAdmin, [email]);
        let admin = false;
        if (checkAdmin.rows[0].admin == ADMIN_KEY)
            admin = true;
        result = {
            credential: data.rowCount,
            admin
        };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    };
    return result;
};

const users = {
    addFavorite,
    getFavorites,
    deleteFavorite,
    createUser,
    validatedUser
}

module.exports = users;