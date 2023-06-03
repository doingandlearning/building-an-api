const projectController = require("../controllers/project.controller");

async function routes(fastify, options) {
  fastify.post("/", projectController.createProject);
  fastify.get("/", projectController.getAllProjects);
  fastify.get("/:id", projectController.getProjectById);
  fastify.put("/:id", projectController.updateProject);
  fastify.delete("/:id", projectController.deleteProject);
}

module.exports = routes;
