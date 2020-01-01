const Router = require("./index");
const Base = require("./base")
const UserController = require("./../controllers/user");

Router.get('/users/:id', UserController.getUser);
Router.get('/users', UserController.getUsers);
Router.post('/users/create', UserController.createUser);
Router.put('/users/:id', Base.protectRoute, UserController.updateUser);

module.exports = Router;