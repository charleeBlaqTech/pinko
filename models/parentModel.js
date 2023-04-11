const mongoose = require('mongoose');
const parentSchema = new mongoose.Schema([
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logintimes: {
      type: Number,
    },
    shiprate: Number,
    online: false,
    socketid: String,
    moment: String,
    fname: String,
    lname: String,
    semail: String,
    addressline1: String,
    addressline2: String,
    sphone: String,
    state: String,
    city: String,
    momentago: String,
    tusers: {
      type: Number,
    },

    lastlogin: {
      type: String,
    },
    lastseen: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: [true, 'This email is already in use'],
    },
    img: String,
    pwrd: {
      type: String,
      minLength: [6, 'Password is too short'],
    },
    birth: {
      type: String,
      // required: [true, 'Date of birth can not be empty'],
    },
    username: {
      type: String,
      unique: [true, 'Username exists'],
      required: [true, 'Username can not be empty'],
      lowercase: true,
    },
    childuserid: Number,
    regdate: String,
    randno: String,
    newlogin: String,
    sn: Number,
    phone: String,
    userid: Number,
    laststudentname: String,
    laststudentid: Number,
    activeStatus: {
      default: 'active',
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    iama: {
      type: String,
      enum: ['student', 'admin', 'parent', 'photographer', 'teacher'],
      default: 'parent',
    },
    admin: {
      type: Boolean,
      default: false,
    },
    schoolname: {
      type: String,
      lowercase: true,
    },
    schoolcode: {
      type: Number,
    },
    class: {
      type: String,
    },
    products: {
      name: String,
      id: Number,
      price: Number,
      itempicture: String,
    },
    bought: {
      name: String,
      id: Number,
      price: Number,
      itempicture: String,
    },
  },
]);

module.exports = new mongoose.model('parent', parentSchema);
