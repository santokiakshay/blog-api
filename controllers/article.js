const articleModel = require("../models/article");
const { Validator } = require('node-input-validator');
const controllerName = "Article"

const list = async (req, res) => {
    try {

        const articleData = await articleModel.find({ isDeleted: false }).lean();
        return res.status(200).send({
            status: true,
            message: ``,
            data: articleData
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.list = list;

const getById = async (req, res) => {
    try {

        const id = req.params.id;
        const articleData = await articleModel.findById(id).where({ isDeleted: false }).lean();
        if (!articleData) {
            return res.status(400).send({
                status: false,
                message: `${controllerName} not found`,
                data: {}
            });
        }
        return res.status(200).send({
            status: true,
            message: ``,
            data: articleData
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.getById = getById;

const paginate = async (req, res) => {
    try {

        let { page, limit, search, order, orderBy } = req?.query;
        page = parseInt(page || 1);
        limit = parseInt(limit || 10);
        orderBy = orderBy || "createdAt";
        order = order == "asc" ? 1 : -1;

        let aggregate = [
            {
                $match: { isDeleted: false }
            }
        ];
        if (search) {
            aggregate.push({
                $match : {
                    $or: [
                        { title: { $regex: search } },
                        { description: { $regex: search } },
                        { slug: { $regex: search } },
                    ]
                }
            });
        }

        aggregate.push(
            {
                $sort: { [orderBy]: order }
            },
            {
                $skip: ((limit * page) - limit)
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category"
                }
            }
        )

        const articleData = await articleModel.aggregate(aggregate);
        return res.status(200).send({
            status: true,
            message: ``,
            data: articleData
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.paginate = paginate;

// create article
const create = async (req, res) => {
    try {

        const reqData = req?.body;
        const validator = new Validator(reqData, {
            title: 'required',
            description: 'required',
            category_id: 'required|mongoId',
            slug: "required"
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

        const articleData = await articleModel.create({
            title: reqData.title,
            description: reqData.description,
            category_id: reqData.category_id,
            slug: reqData.slug,
        })
        return res.status(200).send({
            status: true,
            message: `${controllerName} created succesfully.`,
            data: { article_id: articleData?._id }
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.create = create;

const update = async (req, res) => {
    try {

        const id = req.params.id;
        const reqData = req?.body;
        const validator = new Validator(reqData, {
            title: 'required',
            description: 'required',
            category_id: 'required|mongoId',
            slug: "required"
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

        const articleData = await articleModel.findById(id);
        if (!articleData) {
            return res.status(400).send({
                status: false,
                message: `${controllerName} not found`,
                data: {}
            });
        }

        articleData.title = reqData.title;
        articleData.description = reqData.description;
        articleData.category_id = reqData.category_id;
        articleData.slug = reqData.slug;
        await articleData.save();
        return res.status(200).send({
            status: true,
            message: `${controllerName} update succesfully.`,
            data: { article_id: articleData?._id }
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.update = update;

const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const articleData = await articleModel.findById(id).where({ isDeleted: false });
        if (!articleData) {
            return res.status(400).send({
                status: false,
                message: `${controllerName} not found`,
                data: {}
            });
        }

        articleData.isDeleted = true;
        await articleData.save();
        return res.status(200).send({
            status: true,
            message: `${controllerName} deleted succesfully.`,
            data: {}
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error?.message,
            data: {}
        });
    }
}
module.exports.destroy = destroy;