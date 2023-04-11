const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema([
  {
    packageid: Number,
    username: String,
    quantity: Number,
    packagename: String,
    priceperpackage: Number,
    orderavatar: String,
    totalunitsprice: Number,
    dateordered: String,
    parentid: Number,
    studentid: Number,
    sn: Number,
    gsn: Number,
    picode: Number,
    studentname: String,
    momentago: String,
    moment: String,
    justdate: String,
    ordercode: {
      type: Number,
    },
    paid: Boolean,
    cleared: Boolean,
    schoolcode: String,
  },
]);

module.exports = new mongoose.model('order', OrderSchema);
