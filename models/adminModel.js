const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema([
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    host: Boolean,
    slave: Boolean,
    pending: Boolean,
    addadmin: {
      type: Number,
    },
    logintimes: {
      type: Number,
    },
    userid: String,
    online: false,
    tusers: {
      type: Number,
    },

    lastseen: {
      type: String,
    },
    uploads: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: [true, 'This email is already in use'],
    },
    img: String,
    fpwrd: String,
    role: String,
    pwrd: {
      type: String,
      minLength: [6, 'Password is too short'],
    },
    codar: String,
    pwrdb: {
      type: String,
      minLength: [6, 'Password is too short'],
    },
    phone: Number,
    secret: String,
    username: {
      type: String,
      required: [true, 'Username can not be empty'],
      lowercase: true,
    },

    regdate: String,
    reset: String,
    moment: String,
    momentago: String,
    randno: String,
    newlogin: String,
    sn: String,
    activeStatus: {
      default: 'active',
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    restrict: Boolean,
    iama: {
      type: String,
      enum: ['student', 'admin', 'parent', 'photographer', 'teacher'],
      default: 'admin',
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: true,
    },
    adminid: Number,
    adminshiprate: Number,
  },
]);

module.exports = new mongoose.model('admin', adminSchema);
