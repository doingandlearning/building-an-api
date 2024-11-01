const fastify = require("fastify")({ logger: false });
const mongoose = require("mongoose");
require("dotenv").config();
const jwtPlugin = require("./plugins/jwtPlugin");

const { basicAuth } = require("./middlewares/auth")

fastify.register(jwtPlugin)

// Import my routes
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
// Connect to my database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log("Error connecting to database", e));

// start my server
fastify.register(userRoutes, { prefix: "/api/v1/users" });
fastify.register(projectRoutes, { prefix: "/api/v1/projects" });

// fastify.addHook("preHandler", basicAuth);


const start = async () => {
  try {
    fastify.listen({ port: process.env.PORT || 5000 });
    fastify.log.info(
      `Server is running on port ${fastify.server.address().port}`
    );
  } catch (error) { }
};

start();
