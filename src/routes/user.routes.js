const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

async function routes(fastify, options) {
  fastify.get("/", userController.getAllUsers);
  fastify.get("/:id", userController.getUserById);
  fastify.post("/", { preHandler: auth }, userController.createUser);
  fastify.put("/:id", userController.updateUser);
  fastify.delete("/:id", userController.deleteUser);
}

module.exports = routes;
