const Project = require("../models/project.model");
const User = require("../models/user.model");

async function createProject(request, reply) {
  try {
    // confirm that the projectManager id exists in the database
    // and is valid
    const projectManager = await User.findById(request.body.projectManager);
    if (
      !projectManager ||
      !["Admin", "Project Manager"].includes(projectManager.role)
    ) {
      return reply.status(400).send({ message: "Invalid project manager" });
    }

    // verify that the team members exist
    // and I'll send reply if one of them is wrong
    for (let memberId of request.body.teamMembers) {
      const teamMember = await User.findById(memberId);
      if (!teamMember) {
        return reply
          .status(400)
          .send({ message: `Invalid team member: ${memberId}` });
      }
    }

    // create my project
    const project = new Project(request.body);
    await project.save();
    // return that
    reply.send(project);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function getAllProjects(request, reply) {
  try {
    const projects = await Project.find()
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email role");
    reply.send(projects);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function getProjectById(request, reply) {
  try {
    const project = await Project.findById(request.params.id);
    if (!project) {
      reply.status(404).send({ message: "Project with that id not found" });
    }
    reply.send(project);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function updateProject(request, reply) {
  try {
    const projectId = request.params.id;
    const updates = request.body;

    if (updates.projectManager) {
      const projectManager = await User.findById(updates.projectManager);
      if (
        !projectManager ||
        !["Admin", "Project Manager"].includes(projectManager.role)
      ) {
        return reply.status(400).send({ message: "Invalid project manager" });
      }
    }

    // verify that the team members exist
    // and I'll send reply if one of them is wrong
    if (updates.teamMembers) {
      for (let memberId of updates.teamMembers) {
        const teamMember = await User.findById(memberId);
        if (!teamMember) {
          return reply
            .status(400)
            .send({ message: `Invalid team member: ${memberId}` });
        }
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, updates, {
      new: true,
    });

    if (!updatedProject) {
      return reply
        .status(404)
        .send({ message: "No project with that id found" });
    }

    reply.send(updatedProject);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function deleteProject(request, reply) {
  try {
    const deletedProject = await Project.findByIdAndDelete(request.params.id);

    if (!deletedProject) {
      return reply
        .status(404)
        .send({ message: "No project with that id found" });
    }

    reply.status(204).send("");
  } catch (error) {
    reply.status(400).send(error);
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
