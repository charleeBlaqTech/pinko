window.addEventListener('load', function(){
  //Switch Option

  const gobject = {};

  const veri = document.getElementById('veri');
  veri.style.display = 'none';
  const cart = document.getElementById('cartlength');
  const coded = document.getElementById('coded');
  const ihere = document.getElementById('ihere');
  const tayo = document.getElementById('tayo');
  const carte = document.getElementById('cartlengthh');
  const fcome = Number(coded.value);
  const oboshi = document.querySelectorAll('.oboshi');
  const minusb = document.querySelectorAll('.minusb');
  const addb = document.querySelectorAll('.addb');
  const newcarts = document.getElementById('newcarts');
  const allform = document.querySelectorAll('.tony');
  const hidden = document.querySelectorAll('.hidden');
  tayo.style.display = 'none';

  function allhid() {
    var sum = 0;
    hidden.forEach((ee) => {
      sum = sum + Number(ee.value);
    });
    cart.innerHTML = fcome + sum;
    carte.innerHTML = fcome + sum;
    if (sum > 0) {
      veri.style.display = 'block';
    } else {
      veri.style.display = 'none';
      tayo.style.display = 'none';
    }
  }
  // allhid();
  // alert([...allform] + " is forms");
  let garray = [];

  // oboshi.forEach(function (el, index) {
  //   el.style.display = 'none';
  //   el.closest('select').style.display = 'none';
  // });
  minusb.forEach(function (el, index) {
    el.style.display = 'none';
    // el.closest('select').style.display = 'none';
  });

  addb.forEach(function (el, index) {
    el.addEventListener('click', function () {
      const forme = el.closest('form');
      const selectvalue = forme.package.value;
      forme.hiddene.value = 1;
      el.style.display = 'none';
      forme.mminus.style.display = 'block';
      forme.package.style.display = 'none';

      // garray = [];

      allhid();
      const dataa = forme.package.value;

      const filee = {
        packagecode: dataa.split('/')[0],
        picode: dataa.split('/')[1],
        add: true,
        index: index,
        //   index: indii,
      };
      garray.push(filee);
      const dropp = JSON.stringify(garray);
      const myman = document.getElementById('myman');
      myman.value = dropp;
      veri.style.display = 'block';
      tayo.style.display = 'block';
      setTimeout(() => {
        tayo.style.display = 'none';
      }, 5000);
    //   document.cookie = 'samuw= ' + dropp;

      // alert(dropp);
    });
  });
  const clp = document.querySelector('.clp');
  const clpp = document.querySelector('.clpp');
  clp.addEventListener('click', function () {
    ihere.click();
    // alert('jhgfgh')
  });
  clpp.addEventListener('click', function () {
    ihere.click();
    // alert('jhgfgh');
  });

  minusb.forEach(function (el, index) {
    el.addEventListener('click', function (hh, uj) {
      const forme = el.closest('form');
      const selectvalue = forme.package.value;
      forme.hiddene.value = 0;
      el.style.display = 'none';
      forme.pplus.style.display = 'block';
      forme.package.style.display = 'block';

      allhid();
      // garray = garray.splice(index, 1);
      const bad = index;
      const uh = [];
      // alert(...garray)
      const asn = garray.filter((el) => el.index !== bad);
      // garray = [...asn]
      const dropp = JSON.stringify([...asn]);
      const myman = document.getElementById('myman');
      myman.value = dropp;
    //   document.cookie = 'samuw= ' + dropp;

      // alert(myman.value);
    });
  });

  // $('.passs').hide();

  $('input[type=radio][name=Ben]').change(function () {
    console.log(this.value);
    //window.location.href = this.value;
  });

  var countFocus = 0;

  //Close Switch
  $('.addb').click(function () {

    $('#cartlengthdsd').animate({ fontSize: '1em' }, 'fast');
    $('#cartlengthsd').animate({ fontSize: '1em' }, 'fast');
    $('#cartlengthh').animate({ fontSize: '3em' }, 'fast');
    $('#cartlengthh').animate({ fontSize: '1em' }, 'fast');
    // $(this).closest('.commot').remove();

    // $(this).closest('.commot').css('border', 'solid 1px red');
    // $(this).closest('.commot').css('border', 'solid 1px blue');
    // $(this).closest('.commot').css('border', 'solid 1px yellow');
    // $(this).closest('.commot').css('border', '0');
    //   $(this).hide();
    //   $(this).closest('.sawa').remove();

  //   setTimeout(function () {
  //     const cart = $('#cartlength').html();
  //     $('#cartlength').html(Number(cart) + 1);
  //     // $('#cartlengthh').html(Number(cart) + 1);
  //   }, 1000);
  });

  $('.select-box__current').on('click', function () {
    if ($(this).is(':focus')) {
      countFocus++;
      if (countFocus == 2) {
        this.blur();
        countFocus = 0;
      }
    }
  });
})