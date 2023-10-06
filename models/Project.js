// projectModel.js (using Mongoose ODM)

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  created:{type:Date, default:Date.now}
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
