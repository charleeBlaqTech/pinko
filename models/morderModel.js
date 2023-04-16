const mongoose = require('mongoose');
const MorderSchema = new mongoose.Schema([
  {
    packageid: Number,
    username: String,
    quantity: Number,
    packagename: String,
    priceperpackage: Number,
    orderavatar: String,
    totalunitsprice: Number,
    dateordered: String,
    orderjson: String,
    parentid: Number,
    studentid: Number,
    sn: Number,
    gsn: Number,
    picode: Number,
    orderlength: Number,
    studentname: String,
    momentago: String,
    moment: String,
    justdate: String,
    sordercode: {
      type: Number,
    },
    paid: Boolean,
    cleared: Boolean,
    schoolcode: String,
    total:Number,
    gross:Number,
    gross:Number,
    vat:Number,
  },
]);

module.exports = new mongoose.model('morder', MorderSchema);
