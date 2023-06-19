const User = require('../models/user.model');

require('dotenv').config()

async function apiKeyAuth(request, reply) {
	if (['GET', 'HEAD'].includes(request.method)) {
		return;
	}
	const apiKey = request.headers['x-api-key'];
	const knownKey = process.env.APIKEY

	if (!apiKey || apiKey !== knownKey) {
		return reply.code(401).send({ error: "Unauthorized" })
	}
}

async function basicAuth(request, reply) {
	const authHeader = request.headers['authorization'];

	if (!authHeader) {
		return reply.status(401).send({ error: "No authorization header" })
	}

	const [authType, authKey] = authHeader.split(" ");

	if (authType !== 'Basic') {
		return reply.status(401).send({ error: "Requires basic auth (username/password)" })
	}

	const [email, password] = Buffer.from(authKey, 'base64').toString('ascii').split(":")

	try {
		const user = await User.findOne({ email }).select("password")

		if (!user) {
			return reply.status(401).send({ error: "User not found." });
		}

		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			return reply.status(401).send({ error: "Incorrect password." });
		}
	} catch (error) {
		console.log(error)
		return reply.status(500).send({ error: "An error occurred during authorization." })
	}
}

module.exports = { apiKeyAuth, basicAuth }