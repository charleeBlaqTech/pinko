const mongoose = require('mongoose');
const PersonalSchema = new mongoose.Schema([
  {
    pixname: {
      type: String,
      lowercase: true,
    },
    picode: Number,
    for: String,
    uploadedby: {
      type: String,
      lowercase: true,
    },
    schoolname: {
      type: String,
      lowercase: true,
    },
    schoolcode: {
      type: Number,
      lowercase: true,
    },
    class: {
      type: String,
    },
    imgdir: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paidon: String,
    uploaddate: String,
    sn: Number,
    downloadtimes: Number,
    camerauserid: Number,
    studentuserid: Number,
    wm: String,
    order: Number,
    moment: String,
    momentago: String,
    uploads:Number
  },
]);

module.exports = new mongoose.model('personal', PersonalSchema);
