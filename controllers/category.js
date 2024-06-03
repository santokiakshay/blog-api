const categoryModel = require("../models/category");

// category list for dropdown
const list = async (req, res) => {
    try {

        const categoryData = await categoryModel.find({ isDeleted: false }).lean();
        return res.status(200).send({
            status: true,
            message: '',
            data: categoryData
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