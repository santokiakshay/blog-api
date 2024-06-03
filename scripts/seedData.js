const categoryModel = require("../models/category");
const preDefinedCategory = [
    {
        name: "Food"
    },
    {
        name: "Educations"
    },
    {
        name: "Businessmen"
    },
    {
        name: "Positions"
    }
];

/**
 * Load Seed data to get started with some basic stuff.
 */
async function initSeedData() {
    const categoryData = await categoryModel.countDocuments({
        isDeleted: false
    });
    if (!categoryData) {
        await categoryModel.insertMany(preDefinedCategory);
    }
  
    console.log('Seed data loaded...');
  }
  
  module.exports = {
    initSeedData,
  };