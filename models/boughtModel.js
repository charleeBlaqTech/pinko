const mongoose = require('mongoose');
const boughtSchema = new mongoose.Schema({
  pixname: {
    type: String,
    trim: true,
    lowercase: true,
  },
  parentname: {
    type: String,
    trim: true,
    lowercase: true,
  },
  studentname: {
    type: String,
    trim: true,
    lowercase: true,
  },
  date: {
    type: String,
  },
  imgdir: String,
  wm: String,
  parentuserid: Number,
  studentuserid: Number,
});

module.exports = new mongoose.model('bought', boughtSchema);
