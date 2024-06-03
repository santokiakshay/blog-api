const { Schema, model } = require('mongoose');

const collectionNames = require('../config/models');

const schema = new Schema({
  title: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  category_id: {
    type: Schema.Types.ObjectId,
    default: null
  },
  slug: {
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

module.exports = model("article", schema, collectionNames?.article);