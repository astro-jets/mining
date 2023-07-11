// resourceModel.js (using Mongoose ODM)

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords) {
          return coords.length === 2; // Make sure there are exactly 2 coordinates (longitude, latitude)
        },
        message: 'Coordinates must be an array of two numbers [longitude, latitude]'
      }
    }
  },
  description: { type: String, required: true },
  deposits: { type: String, required: true }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
