const userModel = require("../models/user");
const { Validator } = require('node-input-validator');
const bcrypt = require("bcrypt");
const controllerName = "User";
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// register user
const register = async (req, res, next) => {
    try {
        const reqData = req?.body;
        const validator = new Validator(reqData, {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email',
            password: "required"
        });
        const matched = await validator.check();

        // check validation
        if (!matched) {
            return res.status(400).send({
                status: false,
                message: validator.errors,
                data: {}
            });
        }

        // check email availablity
        const isExist = await userModel.findOne({ email: reqData?.email });
        if (isExist) {
            return res.status(400).send({
                status: false,
                message: "Email already exist.",
                data: {}
            });
        }

        let hashPassword = null;

        // password hash
        try {
            hashPassword = await bcrypt.hash(reqData?.password, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));
        } catch (error) {
            return res.status(400).send({
                status: false,
                message: 'bcrypt err :' + error?.message,
                data: {}
            });
        }

        // store user in database
        const userData = await userModel.create({
            first_name: reqData?.first_name,
            last_name: reqData?.last_name,
            email: reqData?.email,
            password: hashPassword
        });

        return res.status(200).send({
            status: true,
            message: `${controllerName} registered successfully`,
            data: { user_id: userData?._id }
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.register = register;

// Login with email and password
const login = async (req, res) => {
    try {

        const reqData = req?.body;
        const validator = new Validator(reqData, {
            email: 'required|email',
            password: "required"
        });
        const matched = await validator.check();

        // check validation
        if (!matched) {
            return res.status(400).send({
                status: false,
                message: validator.errors,
                data: {}
            });
        }

        let user = await userModel.findOne({ email: reqData?.email }).lean();
        if (!user) {
            return res.status(400).send({
                status: false,
                message: 'Account with this email not found',
                data: {}
            });
        }

        // compare password
        let passwordCompare = null;
        try {
            passwordCompare = await bcrypt.compare(reqData?.password, user?.password);
        } catch (error) {
            return res.status(400).send({
                status: false,
                message: 'bcrypt err :' + error?.message,
                data: {}
            });
        }

        if (!passwordCompare) {
            return res.status(400).send({
                status: false,
                message: 'Incorrect password',
                data: {}
            });
        }

        const apiToken = crypto.randomBytes(20).toString('hex');

        await userModel.updateOne({ _id: user?._id }, { apiToken });

        // generate jwt token
        const token = jwt.sign({ id: user?._id, apiToken: apiToken }, process.env.SECRET);

        delete user?.password;
        delete user?.apiToken;
        return res.status(200).send({
            status: true,
            message: 'Login success',
            data: { userDetails: user, token }
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.login = login;