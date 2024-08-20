const fp = require("fastify-plugin")

module.exports = fp(async function (fastify, opts) {
	fastify.register(require("@fastify/jwt"), {
		secret: process.env.JWT_SIGNING_SECRET
	})

	fastify.decorate("jwtAuth", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.status(401).send({ message: "Unauthorized" })
		}
	})
})