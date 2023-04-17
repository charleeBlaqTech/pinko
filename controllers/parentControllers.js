const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');
const parentModel = require('../models/parentModel');
const studentModel = require('../models/studentModel');
const pictureModel = require('../models/picturesModel');
const schoolModel = require('../models/schoolModel');
const { mailgun, mailgunh } = require('../models/nodemailer');
const { nodem, nodemh } = require('../models/nodemailer');
var moment = require('moment');
const boughtModel = require('../models/boughtModel');
const OrdersModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const MordersModel = require('../models/morderModel');
const Package = require('../models/packageModel');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const packageModel = require('../models/packageModel');
const optionn = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const randomn = require('crypto').randomBytes(5).toString('hex');

// addTextOnImage(pictowaterm)

function capitalise(x) {
  var b = x.charAt(0).toUpperCase() + x.slice(1);
  return b;
}
function currentDate() {
  let ddate = new Date();
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let dateFormat = weekday[ddate.getDay()] + ',' + ddate.toLocaleString();
  return dateFormat;
}
function justDate() {
  // let mm = moment().format('MMMM Do YYYY, h:mm:ss a');
  let mm = moment().format('D MMM, YYYY');
  return mm;
}
function getserialnum(bh) {
  var oboi = Math.random() + 1;
  var num = Math.floor(oboi * bh);
  return num;
}
const schoolz = async (req, res) => {
  const schools = await schoolModel.find().sort({ sn: 'desc' });

  schools.map(async (el, index) => {
    const schoolcode = el.schoolcode;
    const parents = await Parents.find({ schoolcode: schoolcode });
    el.parentslength = parents.length;
    await el.save();
    const students = await Students.find({ schoolcode: schoolcode });
    el.studentlength = students.length;
    await el.save();
    const teachers = await Teachers.find({ schoolcode: schoolcode });
    el.teacherlength = teachers.length;
    await el.save();
  });

  const schoole = await schoolModel.find().sort({ sn: 'desc' });
};

module.exports = {
  saveSignupdetails: async (req, res) => {
    const details = req.signupdetails;
    console.log(
      details.name +
        ' this are details from user received fron vpin middleware '
    );

    const hpwrd = await bcrypt.hash(details.pwrd, 10);

    const parid = getserialnum(1000000);
    const shiprate = await adminModel.findOne({ host: true });

    try {
      await parentModel.create({
        name: details.name,
        email: details.email,
        phone: details.phone,
        username: details.username,
        pwrd: hpwrd,
        newlogin: '',
        logintimes: 0,
        shiprate: shiprate.adminshiprate,
        laststudentname: 'None',
        lastlogin: justDate(),
        // schoolname: student.schoolname,
        regdate: currentDate(),
        userid: parid,
        // schoolcode: student.schoolcode,
        // childuserid: student.userid,
      });
      const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE Welcome ${capitalise(details.username)} </title>
            </head>
            <style>
                body{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    text-align: center;
                    text-transform: capitalize;
                }
                h1{
                    padding: 0 2%;
                    text-transform: capitalize;
                }
                
            </style>
            <body>

                

                <h1>Welcome to PPSE </h1>


                <div>
                    <span>Hi ${capitalise(details.username)} </span>
                    <h2>You have Signed up successfully</h2>

                    <p>Your account has been successfully created ,kindly find your account details below</p>
                    <br>
                    <br>
                    <br>
                    <p>Username : ${details.username}</p>
                    <p>Password : ${details.pwrd}</p>
                </div>


                
                
            </body>
            </html>

          `;
      const email = details.email;
      const subject = `PPSE`;

      // mailgunh.mail(html, email, subject);
      nodemh.mail(html, email, subject);

      const admins = await adminModel.find();
      admins.map((el) => {
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE Welcome ${capitalise(details.username)} </title>
            </head>
            <style>
                body{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    text-align: center;
                    text-transform: capitalize;
                }
                h1{
                    padding: 0 2%;
                    text-transform: capitalize;
                }
                
            </style>
            <body>

                

                <h1>PPSE New Parent sign-up</h1>


                <div>
                    <span>Hi ${capitalise(el.username)} </span>
                    <h2>${capitalise(details.username)} just signed up</h2>

                    <p>Kindly find his/her account details below</p>
                    <br>
                    <br>
                    <br>
                    <p>Names : ${details.name}</p>
                    <p>Username : ${details.username}</p>
                    <p>Password : ${details.pwrd}</p>
                </div>


                
                
            </body>
            </html>

          `;
        const semail = el.email;
        const subject = 'New User sign up';

        // mailgunh.mail(html, email, subject);
        nodemh.mail(html, semail, subject);
      });
      res.render('signuppage', {
        layout: 'nothing',
        alerte: 'Your Account has been succesfully created ',
        title: 'Congratulations',
        icon: 'success',
        // home:true
      });
    } catch (err) {
      console.log('cannot save details due to ' + err);
      res.render('signuppage', {
        alerte:
          'This operation can not be completed at this moment ,pls try again later.',
        icon: 'error',
        layout: 'nothing',
        title: 'Pls try again later.',
        // home: true,
      });
    }
  },
  confirmpayment: async (req, res) => {
    const packages = await Package.find();

    // try {
    const myJSON = req.cookies.myjson;
    const arrayofobj = JSON.parse(myJSON);
    const oocode = getserialnum(10000);

    // await OrdersModel.deleteMany();
    // await MordersModel.deleteMany();
    const sn = await OrdersModel.find({ parentid: req.user.userid });
    const gsn = await OrdersModel.find();
    await arrayofobj.map(async (el) => {
      await MordersModel.create({
        sordercode: oocode,
        sn: sn.length + 1,
        gsn: gsn.length + 1,
        orderavatar: el.orderavatar,
        packageid: el.packageid,
        quantity: el.quantity,
        packagename: el.packagename,
        priceperpackage: el.priceperpackage,
        totalunitsprice: el.totalunitsprice,
        justdate: el.justdate,
        dateordered: el.dateordered,
        username: el.username,
        studentname: el.studentname,
        parentid: el.parentid,
        studentid: el.studentid,
        paid: true,
        cleared: false,
        schoolcode: el.schoolcode,
      });
    });
    await OrdersModel.create({
      ordercode: oocode,
      orderjson: myJSON,
      sn: sn.length + 1,
      gsn: gsn.length + 1,
      orderlength: arrayofobj.length,
      studentname: arrayofobj[0].studentname,
      cleared: false,
      totalunitsprice: arrayofobj[0].totalunitsprice,
      justdate: arrayofobj[0].justdate,
      dateordered: arrayofobj[0].dateordered,
      username: arrayofobj[0].username,
      studentname: arrayofobj[0].studentname,
      parentid: arrayofobj[0].parentid,
      studentid: arrayofobj[0].studentid,
      paid: true,
      cleared: false,
      moment: moment().format('YYYY-MM-DD HH:mm:ss'),
      schoolcode: arrayofobj[0].schoolcode,
      gross: Number(arrayofobj[0].gross.split(',').join('')),
      ship: Number(arrayofobj[0].vat),
      total: Number(arrayofobj[0].total.split(',').join('')),
    });
    const tablee = arrayofobj.map(
      (el, index) =>
        `
                <tr>
                    <td>Item ${index + 1}</td>
                    <td>${el.ordercode}</td>
                    <td>${el.quantity}</td>
                    <td>${el.packagename}</td>
                    <td>${el.totalunitsprice.toLocaleString('en', optionn)}</td>
                </tr>
            `
    );

    const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${
                  process.env.websitename
                } Your Order has been booked</title>
            </head>
            <style>
                body{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    text-align: center;
                    text-transform: capitalize;
                }
                h1{
                    padding: 0 2%;
                    text-transform: capitalize;
                }
                .cocobody {
                  margin-top: 20px;
                  text-align: center;
                  align-items: center;
                  padding: 30px 0;
                  font-size: 15px;
                  text-transform: capitalize;
                  
                  color: black;
                }
                table {
                  margin: 0 auto;
                    outline-style: dashed;
                  background-color: black;
                  color: white;
                  
                }
                thead {
                  outline-style:dotted;
                  margin-bottom: 10px;
                  height:50px;

                }
                
                td {
                  padding: 10px 5px;
                }
                tr{
                  height:10px;
                  padding:40px 3px

                }
                
            </style>
            <body>

                

                <h1>Your Order was Succesful.</h1>


                <div>
                    <span>Hi ${capitalise(req.user.username)} </span>
                    <h2>Your order has been placed</h2>


                    <div class="cocobody">
                      <table>
                        <thead>
                          <td>S/n</td>
                          <td>Ordercode</td>
                          <td>Quantity</td>
                          <td>Package</td>
                          <td>Price(s) in AED</td>
                        </thead>
                        <tbody id="orders">
                          ${tablee}

                        </tbody>
                        


                        
                      </table>
                      <div style="color:black;">
                          <p>Gross : AED ${arrayofobj[0].gross.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                          <p>Shipping : AED ${req.user.shiprate.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                          
                          <p>Total : AED ${arrayofobj[0].total.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                        </div>
                      <p>Our shipping Agent(s) will reach out to you in less than 48 working hours</p>


                    </div>
                    
            

                    
                </div>


                
                
            </body>
            </html>

          `;
    const email = req.user.email;
    const subject = `PPSE`;
    await res.clearCookie('myjson');
    // res.clearCookie('stringedorder');

    // mailgunh.mail(html, email, subject);
    nodemh.mail(html, email, subject);

    const admins = await adminModel.find();
    await admins.map((el) => {
      const tablee = arrayofobj.map(
        (el, index) =>
          `
                <tr>
                    <td>Item ${index + 1}</td>
                    <td>${el.ordercode}</td>
                    <td>${el.quantity}</td>
                    <td>${el.packagename}</td>
                    <td>${el.totalunitsprice.toLocaleString('en', optionn)}</td>
                </tr>
            `
      );
      const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE New Order(s)
       </title>
            </head>
            <style>
                body{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    text-align: center;
                    text-transform: capitalize;
                }
                h1{
                    padding: 0 2%;
                    text-transform: capitalize;
                }
                .cocobody {
                  margin-top: 20px;
                  text-align: center;
                  align-items: center;
                  padding: 30px 0;
                  font-size: 15px;
                  text-transform: capitalize;
                  color: black;

                }
                table {
                  margin: 0 auto;
                    outline-style: dashed;
                  background-color: black;
                  color: white;
                  
                }
                thead {
                  outline-style:dotted;
                  margin-bottom: 10px;
                  height:50px;

                }
                
                td {
                  padding: 10px 5px;
                }
                tr{
                  height:10px;
                  padding:40px 3px

                }
                
                
            </style>
            <body>

                

                <h1>PPSE New Order</h1>


                <div>
                    <span>Hi ${capitalise(el.username)} </span>
                    <h2>${capitalise(
                      req.user.username
                    )} just placed the following order</h2>

                    <div class="cocobody">
                      <table>
                        <thead>
                          <td>S/n</td>
                          <td>Ordercode</td>
                          <td>Quantity</td>
                          <td>Package</td>
                          <td>price in AED</td>
                        </thead>
                        <tbody id="orders">
                          ${tablee}

                        </tbody>
                        


                        
                      </table>
                      <div style="color:black;">
                          
                          <p>Gross : AED ${arrayofobj[0].gross.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                          <p>Shipping : AED ${req.user.shiprate.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                          <p>Total : AED ${arrayofobj[0].total.toLocaleString(
                            'en',
                            optionn
                          )}</p>
                        </div>

                      <small>${req.user.name}</small>
                      <br>
                      <small>${req.user.email}</small>
                      <br>
                      <small>${req.user.phone}</small>
                      <br>
                      <small>Student in focus : ${
                        arrayofobj[0].studentname
                      }</small>
                      <br>
                      <small>Date and time of order : ${
                        arrayofobj[0].dateordered
                      }</small>
                      

                    </div>

                    
                    
                </div>


                
                
            </body>
            </html>

          `;
      const semail = el.email;
      const subject = 'New Order !';

      // mailgunh.mail(html, el.email, subject)
      nodemh.mail(html, semail, subject);
    });

    let myorders = await OrdersModel.find({
      parentid: req.user.userid,
    })
      .where('cleared')
      .equals(false)
      .sort({ sn: 'desc' });
    const torders = [...myorders];
    torders.map((order, index) => (order.sne = torders.length - index));
    await cartModel.deleteMany({ parentid: req.user.userid });
    req.user.cartlength = 0;
    await req.user.save()

    res.render('myorders', {
      layout: 'parent',
      parent: req.user,
      alerte: 'Your order has been placed succesfully ',
      title: 'Payment confirmed !',
      icon: 'success',
      orders: torders,
    });
    // }
    // catch (err) {
    //   console.log(err.message + ' is console from payment');
    //   res.render('pdb', {
    //     layout: 'parent',
    //     parent: req.user,
    //     alerte:
    //       'You can not complete this request at this moment. Please try again later',
    //     title: 'Error !',
    //     icon: 'error',
    //     packages: packages,
    //   });
    //   // await OrdersModel.create({
    //   //   ordercode: el.ordercode,
    //   //   sn: sn.length + 1,
    //   //   gsn: gsn.length + 1,
    //   //   orderavatar: el.orderavatar,
    //   //   packageid: el.packageid,
    //   //   quantity: el.quantity,
    //   //   packagename: el.packagename,
    //   //   priceperpackage: el.priceperpackage,
    //   //   totalunitsprice: el.totalunitsprice,
    //   //   justdate: el.justdate,
    //   //   dateordered: el.dateordered,
    //   //   username: el.username,
    //   //   studentname: el.studentname,
    //   //   parentid: el.parentid,
    //   //   studentid: el.studentid,
    //   //   paid: true,
    //   //   cleared: false,
    //   //   schoolcode: el.schoolcode,
    //   // });
    // }
  },
  packages: async (req, res) => {
    const packages = await Package.find();

    res.render('parentpackages', {
      layout: 'parent',
      parent: req.user,
      packages: packages,
    });
  },
  login: async (req, res) => {
    const { username, pwrd } = req.body;
    const identity = 'parent/';

    if (username && pwrd) {
      const ifusername = await parentModel.findOne({ username: username });
      if (ifusername) {
        const ifhpwrd = await bcrypt.compare(pwrd, ifusername.pwrd);
        if (ifhpwrd) {
          ifusername.logintimes = ifusername.logintimes + 1;
          ifusername.lastlogin = ifusername.newlogin;
          ifusername.newlogin = currentDate();
          ifusername.moment = moment().format('YYYY-MM-DD HH:mm:ss');

          await ifusername.save();
          await res.cookie('authp', identity + ifusername.userid, {
            secure: true,
            maxAge: 3600000,
          });
          // const student= await studentModel.findOne({userid:ifusername.childuserid})
          ifusername.logintimes = ifusername.logintimes + 1;
          ifusername.lastseen = currentDate();
          await ifusername.save();
          // const pictures = await wmModel.find({ studentuserid :student.userid});
          // console.log(pictures+ " is wm")
          const packages = await Package.find();
          console.log(packages + ' packages');

          res.render('pdb', {
            layout: 'parent',
            parent: ifusername,
            icon: 'success',
            packages: packages,
            title: 'Logged in Successfully',
            // pictures: pictures,
            alerte: 'Welcom ' + capitalise(ifusername.username),
          });
        } else {
          res.render('signuppage', {
            icon: 'error',
            layout: 'nothing',
            title: 'Security concern ',
            alerte: ' Incorrect Password !',
          });
        }
      } else {
        res.render('signuppage', {
          icon: 'error',
          layout: 'nothing',

          alerte: process.env.usernotfound,
        });
      }
    } else {
      res.render('signuppage', {
        icon: 'error',
        layout: 'nothing',
        alerte: process.env.fillinputs,
      });
    }
  },

  enterchildusername: async (req, res) => {
    const { username } = req.body;
    const student = await studentModel.findOne({ username });
    if (student) {
      const stdntpictures = await pictureModel
        .find({ for: username })
        .sort({ sn: 'desc' });

      const pico = stdntpictures.map((el) => {
        addTextOnImage('public/' + el.imgdir);
      });
      console.log(pico);

      res.render('parentwithchild', {
        parent: req.user,
        child: student,
        pictures: pico,
        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } else {
      res.render('dashboard', {
        parent: req.user,
        alert: 'Student with username  ' + username + ' doesnt exist',
      });
    }
  },
  carts: async (req, res) => {
    const carts = await cartModel
      .find({ parentid: req.user.userid })
      .sort({ sn: 'desc' });
    const student = await studentModel.findOne({
      userid: req.user.laststudentid,
    });
    // console.log(carts[0].avatar + " is avatar")
    res.render('checkout', {
      layout: 'parent',
      parent: req.user,
      child: student,
      carts: carts,
      cartlength: carts.length,
      vat: parseInt(req.user.shiprate),
    });
  },
  tocart: async (req, res) => {
    const tocart = req.body.myman;

    const obj = JSON.parse(tocart)
    // const picture = await pictureModel.findOne({ picode: obj[0].picode });

    console.log(obj + ' is parsed data');
    for(let i = 0 ; i < obj.length ; i++) {
      const picture= await pictureModel.findOne({picode: obj[i].picode})
      console.log(picture + " from line 753")
      const package = await packageModel.findOne({
        packageid: obj[i].packagecode,
      });
      const sn = await cartModel.find({ parentid: req.user.userid });
      await cartModel.create({
        packageid: obj[i].packagecode,
        avatar: picture.imgdir,
        picturecode: obj[i].picturecode,
        parentid: req.user.userid,
        quantity: 1,
        sn: sn.length + 1,
        packagename: package.name,
        packageprice: package.price,
        gross: package.price,
        cartcode: getserialnum(100000),
        moment: moment().format('YYYY-MM-DD HH:mm:ss'),
        cartdate: justDate(),
      });
    }
    const carts = await cartModel.find({ parentid :req.user.userid}).sort({sn:"desc"})
    const student = await studentModel.findOne({
      userid: req.user.laststudentid,
    })
    req.user.cartlength=carts.length
    await req.user.save()
    res.render('checkout', {
      layout: 'parent',
      parent: req.user,
      child: student,
      carts: carts,
      cartlength:carts.length,
      vat: parseInt(req.user.shiprate),
    });


    // const student = await studentModel.findOne({
    //   userId: req.body.studentuserid,
    // });

    // let withpackages = req.body.opt;
    // console.log(withpackages + ' is with packages');

    // try {
    //   if (!Array.isArray(withpackages)) {
    //     withpackages = [withpackages];
    //   }
    //   let indee = 1;
    //   const objarray = [];
    //   withpackages.map(async (el) => {
    //     console.log(el + ' is el');
    //     const packagecode = el.split('/')[0];
    //     const imagename = el.split('/')[1];
    //     const package = await Package.findOne({ packageid: packagecode });
    //     const img = await pictureModel.findOne({ pixname: imagename });
    //     console.log(' is eachobj ', img, package);

    //     const eachobj = {
    //       wm: img.imgdir,
    //       name: 'Item' + indee,
    //       price: package.price,
    //       packagename: package.name,
    //       packageid: package.packageid,
    //     };
    //     indee++;
    //     objarray.push(eachobj);
    //   });
    //   console.log(objarray + ' is objarray');
    //   const stdntpictures = await pictureModel
    //     .find({ studentuserid: student.userid })
    //     .sort({ sn: 'desc' });
    //   const packages = await Package.find();

    //   // console.log(cba + ' is wms')

      
    // } catch (e) {
    //   console.log(e).message;
    //   const user = req.user;
    //   // cont orderss = await Booked.find({for:req.user.username})
    //   res.render('pdb', {
    //     layout: 'parent',
    //     parent: req.user,
    //     // order: orders,
    //   });
    
  },
  viewbookedorder: async (req, res) => {
    try {
      const parent = req.user;
      const ordercode = req.params.ordercode;
      const oorder = await MordersModel.find({
        sordercode: ordercode,
      });
      const mainorder = await OrdersModel.findOne({
        ordercode: ordercode,
      });
      console.log(mainorder + ' is mainorder');

      res.render('pvieworders', {
        layout: 'parent',
        parent: req.user,
        orders: oorder,
        mainorder: mainorder,
        // gross: gross,
        // vat: vat,
        // total: total,

        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/admin/wrong');
    }
  },
  deletefromparent: async (req, res) => {
    try {
      const parent = req.user;
      const ordercode = req.params.ordercode;
      await OrdersModel.deleteOne({
        ordercode: ordercode,
      });
      await MordersModel.deleteMany({
        sordercode: ordercode,
      });
      const myorders = await OrdersModel.find({
        parentid: parent.userid,
      })
        .where('paid')
        .equals(true);
      const torders = [...myorders];
      torders.map((order, index) => (order.sne = torders.length - index));

      res.render('myorders', {
        layout: 'parent',
        parent: req.user,
        orders: torders,
        // gross: gross,
        // vat: vat,
        // total: total,

        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/admin/wrong');
    }
  },
  deleteclfromparent: async (req, res) => {
    try {
      const parent = req.user;
      const ordercode = req.params.ordercode;
      await OrdersModel.deleteOne({
        ordercode: ordercode,
      });
      await MordersModel.deleteMany({
        sordercode: ordercode,
      });
      const myorders = await OrdersModel.find({
        parentid: parent.userid,
      })
        .where('cleared')
        .equals(true);
      const torders = [...myorders];
      torders.map((order, index) => (order.sne = torders.length - index));

      res.render('parentclearedorders', {
        layout: 'parent',
        parent: req.user,
        orders: torders,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/admin/wrong');
    }
  },
  psettings: async (req, res) => {
    res.render('psettings', {
      layout: 'parent',
      parent: req.user,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  parentclearedorders: async (req, res) => {
    const parent = req.user;
    const myorders = await OrdersModel.find({
      parentid: parent.userid,
    })
      .where('cleared')
      .equals(true);
    const torders = [...myorders];
    torders.map((order, index) => (order.sne = torders.length - index));

    res.render('parentclearedorders', {
      layout: 'parent',
      parent: req.user,
      orders: torders,
    });
  },
  myorders: async (req, res) => {
    try {
      const parent = req.user;
      let myorders = await OrdersModel.find({
        parentid: parent.userid,
      })
        .where('paid')
        .equals(true)
        .where('cleared')
        .equals(false)
        .sort({ sn: 'desc' });
      const torders = [...myorders];
      torders.map((order, index) => (order.sne = torders.length - index));
      res.render('myorders', {
        layout: 'parent',
        parent: req.user,
        orders: torders,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect('/admin/wrong');
    }
  },

  editusername: async (req, res) => {
    const { username, name } = req.body;
    const fusername = req.user.username;
    req.user.name = name;
    await req.user.save();
    const ifusername = await parentModel.findOne({ username: username });
    if (username == fusername) {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
      });
    } else if (!ifusername) {
      const orders = await OrdersModel.find({
        parentid: req.user.userid,
      });

      orders.map(async (el) => {
        el.username = username;
        await el.save();
        console.log(el.username);
      });
      req.user.username = username;

      await req.user.save();

      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
      });
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        title: 'Error',
        alerte: 'Username is in existence',
      });
    }
  },
  finalresetpassword: async (req, res) => {
    try {
      const { vpin } = req.body;
      const jwtvcode = req.cookies.vcode;

      if (jwtvcode) {
        const object = jwt.verify(jwtvcode, process.env.SECRET);
        if (vpin == object.vcode) {
          const parent = await parentModel.findOne({ email: object.email });
          const pwrd = getserialnum(1000000).toString();
          const hpwrd = await bcrypt.hash(pwrd, 10);
          parent.pwrd = hpwrd;
          await parent.save();

          res.clearCookie('vcode');
          const m1 = 'Hi ' + parent.username;
          const m2 = 'Your Reset password is ' + pwrd;
          const subject = 'Password Resset Successfull';
          mailgun.mail(object.email, subject, m1, m2);
          res.render('signuppage', {
            layout: 'nothing',
            title: 'Check your mail for reset password!',
            alerte: 'Your password has been reset ',
            icon: 'success',
          });
        } else {
          res.clearCookie('vcode');

          res.render('signuppage', {
            layout: 'nothing',
            title: 'Incorrect !',
            alerte: 'You have entered an incorrect code',
            icon: 'error',
          });
        }
      } else {
        res.render('signuppage', {
          layout: 'nothing',
          icon: 'error',
          alerte: 'Password recovery expired',
          title: 'Verification failed ! ',
        });
      }
    } catch (err) {
      console.log(err.message);
      res.redirect('/wrong');
    }
  },
  emailupdate: async (req, res) => {
    const { vpin } = req.body;
    const jwtvcode = req.cookies.vcode;

    if (jwtvcode) {
      const object = jwt.verify(jwtvcode, process.env.SECRET);
      if (vpin == object.vcode) {
        req.user.email = object.email;
        res.clearCookie('vcode');
        await req.user.save();

        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
          title: 'Updated !',
          alerte: 'Your email has been succesfully updated',
          icon: 'success',
        });
      } else {
        res.clearCookie('vcode');

        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
          title: 'Incorrect !',
          alerte: 'You have entered an incorrect code',
          icon: 'error',
        });
      }
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        alerte: 'Email verification expired',
        title: 'Verification failed ! ',
      });
    }
  },
  verifymailforgotpwrd: async (req, res) => {
    const { email } = req.body;
    const ifEmail = await parentModel.findOne({ email: email });
    if (ifEmail) {
      const vcode = getserialnum(100000);
      const object = {
        vcode: vcode,
        email: email,
      };
      const secret = process.env.SECRET;

      const jwtvcode = jwt.sign(object, secret, {
        expiresIn: 7200,
      });
      console.log(jwtvcode + ' is jwt vcode');
      res.cookie('vcode', jwtvcode, {
        maxAge: 7200000,
      });
      const m1 = 'Hi ' + ifEmail.username;
      const m2 = 'Your verification code is ' + vcode;
      const subject = 'Password Recovery';
      // mailgun.mail(email, subject, m1, m2);
      nodem.mail(email, subject, m1, m2);
      res.render('getfgvcode', {
        layout: 'nothing',
        title: 'Check your mail !',
        alerte: 'A verification code has been sent to  ' + email,
        icon: 'success',
      });
    } else {
      res.render('signuppage', {
        layout: 'nothing',
        icon: 'error',
        alerte:
          'We do not have any user associated with the email you provided',
        title: 'No user record found',
      });
    }
  },
  editemail: async (req, res) => {
    const { email } = req.body;
    const ifEmail = await parentModel.findOne({ email: email });
    if (!ifEmail) {
      const vcode = getserialnum(100000);
      const object = {
        vcode: vcode,
        email: email,
      };
      const secret = process.env.SECRET;

      const jwtvcode = jwt.sign(object, secret, {
        expiresIn: 7200,
      });
      console.log(jwtvcode + ' is jwt vcode');
      res.cookie('vcode', jwtvcode, {
        maxAge: 7200000,
      });
      const m1 = 'Hi ' + req.user.username;
      const m2 = 'Your verification code is ' + vcode;
      const subject = 'Email verification';
      nodem.mail(email, subject, m1, m2);
      res.render('emailupdate', {
        layout: 'nothing',
        parent: req.user,
        title: 'Check your mail !',
        alerte: 'A verification code has been sent to  ' + email,
        icon: 'success',
      });
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        alerte: 'Email is in use ',
        title: 'Security Concern ',
      });
    }
  },
  editpassword: async (req, res) => {
    const { oldpwrd, newpwrd } = req.body;
    const savedpwrd = req.user.pwrd;

    if (newpwrd.length >= 6) {
      const ifpwrd = await bcrypt.compare(oldpwrd, savedpwrd);

      if (ifpwrd) {
        const hpwrd = await bcrypt.hash(newpwrd, 10);
        req.user.pwrd = hpwrd;
        await req.user.save();

        const m1 = 'Hi ' + req.user.username;
        const m2 = 'Your new password is ' + newpwrd;
        const subject = 'Password Updated Succesfully ';
        const email = req.user.email;
        mailgun.mail(email, subject, m1, m2);
        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
          title: 'New Password created',
          alerte: 'Your password has been changed successfully',
          icon: 'success',
        });
      } else {
        res.cookie('auth', '', {
          maxAge: 0,
          overwrite: true,
        });
        res.cookie('clientid', '', {
          maxAge: 0,
          overwrite: true,
        });
        res.render('home', {
          icon: 'error',
          title: 'Security has been breached !',
          alerte: 'Current password is incorrect !!',
        });
      }
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        title: 'Security threat !',
        alerte: 'New password length is too short !',
      });
    }
  },
  firstcart: async (req, res) => {
    const picodee = req.params.picodee;
    const picture = await pictureModel.findOne({ picode: picodee });
    const student = await studentModel.findOne({
      userid: picture.studentuserid,
    });
    const packages = await Package.find();
    console.log(packages + " is packages available")
    const stdntpictures = await pictureModel.findOne({ picode: picodee }).sort({sn:"desc"})
    res.render('details', {
      parent: req.user,
      layout: 'parent',
      student: student,
      picture:picture,
      pictures: stdntpictures,
      packages: packages,
      studentuserid: student.userid,
      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  findstudent: async (req, res) => {
    const find = req.body.find;
    const student = await studentModel.findOne({ signparent: find });
    if (student) {
      req.suserid = student.userid;
      req.user.laststudentid = student.userid;
      req.user.laststudentname = student.name;
      req.user.lastcode = find;
      await req.user.save();
      console.log(req.suserid + ' is child');

      // const boughts = await boughtModel.find({ parentuserid: req.user.userid });
      // if (boughts) {
      //   const realpictures = await pictureModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   const rl = realpictures.length;

      //   // const paids = paidpixs.filter((el)=>{

      //   // })
      //   const mypix = [];

      //   for (let i = 0; i < boughts.length; i++) {
      //     for (let j = 0; j < rl; j++) {
      //       if (realpictures[j].name == boughts[i].name) {
      //         mypix.push(realpictures[j]);
      //         return realpictures[j];
      //       }
      //     }
      //   }
      //   const stdntpictures = await wmModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   const packages = await Package.find();
      //   req.user.laststudentname=student.name
      //   req.user.laststudentid=student.userid
      //   await req.user.save()

      //   // console.log(packages);

      //   res.render('parentwithchild', {
      //     layout: 'parent',
      //     parent: req.user,
      //     child: student,
      //     wm: stdntpictures,
      //     packages: packages,
      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // } else {
      //   const stdntpictures = await wmModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   req.wm = stdntpictures;

      //   res.render('parentwithchild', {
      //     parent: req.user,
      //     layout: 'parent',
      //     child: student,
      //     wm: stdntpictures,
      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // }

      const stdntpictures = await pictureModel.find({
        studentuserid: student.userid,
      });
      const cart = await cartModel.find({
        studentid: student.userid,
      });


      // req.wm = stdntpictures;
      const packages = await Package.find();

      if (stdntpictures.length > 0 && packages.length > 0) {
        res.render('parentwithchild', {
          parent: req.user,
          layout: 'parent',
          child: student,
          watermark: stdntpictures,
          packages: packages,
          studentuserid: student.userid,
          cartlength: cart.length
          // alert: 'Student with username  ' + username + ' doesnt exist',
        });
      } else {
        const packages = await Package.find();
        console.log('stdnt pictures');

        const user = req.user;
        // cont orderss = await Booked.find({for:req.user.username})
        res.render('pdb', {
          layout: 'parent',
          parent: req.user,
          packages: packages,
          alerte: 'try again later',
          title: ' Pictures are unavailable at the moment',
          cartlength: cart.length,

          // order: orders,
        });
      }
      // if(packages.length > 0) {
      //   // console.log('parentwithchild entered ' + Package+ " consoled");

      // }
      // else{
      //   console.log("parentnopackage template")
      //   res.render('parentnopackage', {
      //     parent: req.user,
      //     layout: 'parent',
      //     child: student,
      //     wm: stdntpictures,
      //     title:"Valid code",
      //     icon:"success",
      //     alerte:"Oops packages are currently not available for this student,you can only view student gallery."

      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // }
    } else {
      const packages = await Package.find();

      const user = req.user;
      // cont orderss = await Booked.find({for:req.user.username})
      res.render('pdb', {
        layout: 'parent',
        parent: req.user,
        packages: packages,
        icon: 'error',
        title: 'Incorrect student-code',
        alerte: 'Student with findcode ' + find + ' doesnt exist',
        // order: orders,
      });
    }
  },
  proceedtopayment: async (req, res) => {
    let { imgdir, packageid, quantity } = req.body;
    let { gross, vat, total } = req.body;
    const studentuserid = req.body.studentuserid;
    const student = await studentModel.findOne({ userid: studentuserid });
    const ship = req.user.shiprate;
    total = total.split(',').join('');

    let ordercodes = {};
    console.log(total + ' is total');
    if (total > 0) {
      total = total;
      if (!Array.isArray(imgdir)) {
        imgdir = [imgdir];
      }
      if (!Array.isArray(packageid)) {
        packageid = [packageid];
      }
      if (!Array.isArray(quantity)) {
        quantity = [quantity];
      }
      const length = imgdir.length;
      let orderss = [];

      console.log(length + ' is length');
      for (let i = 0; i < length; i++) {
        const package = await Package.findOne({ packageid: packageid[i] });
        const ordercode = getserialnum(100000);
        // ordercodes.[i]=ordercode
        const totalu = package.price * quantity[i];

        const ordera = {
          ordercode: ordercode,
          sn: ordercode,
          orderavatar: imgdir[i],
          packageid: packageid[i],
          quantity: quantity[i],
          packagename: package.name,
          priceperpackage: package.price,
          totalunitsprice: totalu,
          justdate: justDate(),
          dateordered: currentDate(),
          username: req.user.username,
          studentname: student.name,
          parentid: req.user.userid,
          studentid: studentuserid,
          paid: false,
          cleared: false,
          moment: moment().format('YYYY-MM-DD HH:mm:ss'),
          schoolcode: student.schoolcode,
          gross: gross,
          vat: Number(ship),
          total: total,
        };

        // await OrdersModel.create({
        //   ordercode: ordercode,
        //   sn: ordercode,
        //   orderavatar: imgdir[i],
        //   packageid: packageid[i],
        //   quantity: quantity[i],
        //   packagename: package.name,
        //   priceperpackage: package.price,
        //   totalunitsprice: totalu,
        //   justdate: justDate(),
        //   dateordered: currentDate(),
        //   username: req.user.username,
        //   studentname: student.name,
        //   parentid: req.user.userid,
        //   studentid: studentuserid,
        //   paid: false,
        //   cleared: false,
        //   schoolcode: student.schoolcode,
        // });

        orderss.push(ordera);
      }
      const myJSON = JSON.stringify(orderss);
      console.log(myJSON + ' is myjson');
      res.cookie('myjson', myJSON);

      // const secret = process.env.SECRET;

      // const gbadun = jwt.sign(ordercodes, secret, {
      //   expiresIn: 300000,
      // });
      // res.cookie('gbadunforlife', gbadun, {
      //   maxAge: 300000,
      // });

      const others = {
        gross: gross,
        vat: parseInt(ship),
        total: total,
      };
      // order.push(others);

      // console.log(order + " is orders")

      // console.log(imgdir, packageid, quantity);

      console.log(studentuserid + ' this are images');
      res.render('payment', {
        layout: 'parent',
        parent: req.user,
        child: student,
        gross: gross,
        vat: parseInt(ship),
        total: total,

        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } else {
      const packages = await Package.find();

      const user = req.user;
      // cont orderss = await Booked.find({for:req.user.username})
      res.render('pdb', {
        layout: 'parent',
        parent: req.user,
        packages: packages,
        title: 'Empty Cart',
        alerte: 'You cannot proceed with an empty cart',
        // order: orders,
      });
    }
  },
  home: async (req, res) => {
    const packages = await Package.find();

    const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('pdb', {
      layout: 'parent',
      parent: req.user,
      packages: packages,
      // order: orders,
    });
  },
  updateshipping: async (req, res) => {
    const {
      fname,
      semail,
      lname,
      sphone,
      state,
      city,
      addressline1,
      addressline2,
    } = req.body;

    req.user.fname = fname;
    req.user.lname = lname;
    req.user.sphone = sphone;
    req.user.state = state;
    req.user.semail = semail;
    req.user.city = city;
    req.user.addressline1 = addressline1;
    addressline2.length > 1
      ? (req.user.addressline2 = addressline2)
      : (req.user.addressline2 = '');
    await req.user.save();

    // const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('shippingdetails', {
      layout: 'parent',
      parent: req.user,
      // order: orders,
    });
  },
  shippingdetails: async (req, res) => {
    const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('shippingdetails', {
      layout: 'parent',
      parent: req.user,
      // order: orders,
    });
  },
  order: async (req, res) => {
    const orderr = req.params.order;
    const pik = await pictureModel.findOne({ pixname: orderr });
    // console.log(pik + " is student pix")
    const useridi = pik.studentuserid;
    const child = await studentModel.findOne({ userid: useridi });
    res.render('paystack', {
      parent: req.user,
      order: pik,
      child: child,
    });
  },
};
