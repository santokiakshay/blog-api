const { Schema, model } = require('mongoose');

const collectionNames = require('../config/models');

const schema = new Schema({
  first_name: {
    type: String,
    default: '',
  },
  last_name: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: null
  },
  apiToken: {
    type: String,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

schema.pre('save', function (next) {
    this.name = `${this.first_name} ${this.last_name}`;
    next();
});

module.exports = model("user", schema, collectionNames?.user);