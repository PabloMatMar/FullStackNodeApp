const express = require('express');
// Rutas de productos
const userCrontrolers = require("../controllers/userControllers");
const userRouter = express.Router();

// entriesApiRouter.get('/', entriesApiController.getEntries);
userRouter.post('/', userCrontrolers.validatedUser);
userRouter.post('/', userCrontrolers.createUser);
//userRouter.post('/signup', userCrontrolers.createUser);
/* entriesApiRouter.delete('/', entriesApiController.deleteEntry);
entriesApiRouter.put('/', entriesApiController.updateEntry); */
userRouter.post('/search/:title', userCrontrolers.addFavorite)

// entriesApiRouter.get('/', entriesApiController.getAllAuthors);

module.exports = userRouter