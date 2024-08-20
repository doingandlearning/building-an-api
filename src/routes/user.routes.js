const userController = require("../controllers/user.controller");
const { basicAuth } = require("../middlewares/auth");
const User = require("../models/user.model")

async function routes(fastify, options) {
  fastify.get("/", { onRequest: [fastify.jwtAuth] }, userController.getAllUsers);
  fastify.get("/:id", userController.getUserById);
  fastify.post("/", userController.createUser);
  fastify.put("/:id", userController.updateUser);
  fastify.delete("/:id", userController.deleteUser);
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    // check the password/username
    try {
      const user = await User.findOne({ email }).select(["password", "role", "firstName", "lastName"])

      if (!user) {
        return reply.status(401).send({ error: "User not found." });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return reply.status(401).send({ error: "Incorrect password." });
      }

      // if valid -> sign a token
      const token = fastify.jwt.sign({
        payload: {
          email, firstName: user.firstName, lastName: user.lastName, role: user.role
        }
      })
      // which we'll return
      reply.send({ token })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: "An error occurred during authorization." })
    }

  })
}

module.exports = routes;
