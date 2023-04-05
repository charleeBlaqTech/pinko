const mongoose = require('mongoose');
const packageSchema = new mongoose.Schema([{
  name: {
    type: String,
    trim: true,
    lowercase: true,
  },
  desc: String,
  price: Number,
  date: {
    type: String,
  },
  packimg: String,
  packageid:Number
}]);

module.exports = new mongoose.model('package', packageSchema);
