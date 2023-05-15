const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  name: { type: String },
  translation: { type: String },
  img: { type: String },
});

module.exports = mongoose.model('Cat', CatSchema);
