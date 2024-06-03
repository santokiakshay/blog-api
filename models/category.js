const { Schema, model } = require('mongoose');

const collectionNames = require('../config/models');

const schema = new Schema({
  name: {
    type: String,
    default: ""
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = model("category", schema, collectionNames?.category);