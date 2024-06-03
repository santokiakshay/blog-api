const jwToken = require('jsonwebtoken');
const userModel = require("../models/user");

verifyToken = async (req, res, next) => {
	try {

		let token = req.headers["authorization"];
		if (!token) {
			return res.status(401).send({
				status: false,
				message: 'No token provided.'
			});
		}

		let decode;

		try {
			decode = await jwToken.verify(token, process.env.SECRET || "");
		} catch (error) {
			console.log(error, "error");
		}

		if (!decode) {
			return res.status(401).send({
				status: false,
				message: 'Unauthorised'
			});
		}

		req.userId = decode.id;
		const userDetails = await userModel.findById(decode?.id);
		if (!userDetails) {
			return res.status(401).send({
				status: false,
				message: 'Unauthorised'
			});
		}

		if (userDetails?.apiToken != decode?.apiToken) {
			return res.status(401).send({
				status: false,
				message: 'Unauthorised'
			});
		}

		req.user = userDetails;

		next();
	} catch (error) {
		return res.status(401).send({
			status: false,
			message: 'Unauthorised'
		});
	}
}

module.exports.verifyToken = verifyToken;