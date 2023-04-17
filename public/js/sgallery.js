//Switch Option

const garray = []

const gobject ={}

const veri = document.getElementById('veri');
veri.style.display = 'none'

const addtc = document.querySelectorAll('.addtoc')
addtc.forEach(function(el){
    el.addEventListener('click', function(){
        const cart = document.getElementById('cartlength');
        // const cartl = Number(cart.innerHTML);
        // cart.innerHTML= cartl + 1
        const forme = this.closest('form')

        const dataa = forme.package.value

        const filee = {
            packagecode:dataa.split('/')[0],
            picode:dataa.split('/')[1]
        }
        // alert(filee)
        garray.push(filee)
        if(garray.length>0){
            veri.style.display = 'block';

        }
        else{
            veri.style.display = 'none';

        }
        
        // divee.remove()

        const dropp = JSON.stringify(garray)
        const myman =document.getElementById('myman')
        // alert(dropp);

        myman.value = dropp
    })
})

$('input[type=radio][name=Ben]').change(function () {
  console.log(this.value);
  //window.location.href = this.value;
});
// $('.addtoc').click(function () {
//     const cart = $('.cartlength')
//     const cartl = Number($('.cartlength').html())
//     const selecta = $(this)
//       .closest('form').package.
//     const selected = selecta.html()
      
//     alert(selected)
//     // fetch('http://localhost:2346/parent/findstudennt', {
//     //   Method: 'POST',
//     //   Headers: {
//     //     Accept: 'application.json',
//     //     'Content-Type': 'application/json',
//     //   },
//     //   Body: body,
//     //   Cache: 'default',
//     // });
//     cart.html(cartl + 1);

//     // alert($(this).attr('id'))
//     console.log(this.value);
  
// });

var countFocus = 0;

//Close Switch
$('.addtoc').click(function () {
//   $(this).closest('.commot').animate({ marginLeft: '-17em' })
    

  $('#cartlength').animate({
    left:'+=400px',
    // height:'toggle',
    })
    $('#cartlength').animate({ "color": 'green' });
    $('#cartlength').animate({ fontSize: '5em' },'fast');
    $('#cartlength').animate({ fontSize: '3em' },'fast');
        $(this).closest('.commot').remove();

    setTimeout(function() {
        const cart = $('#cartlength').html();
        $('#cartlength').html(Number(cart) + 1);

    },1000)

    

})


$('.select-box__current').on('click', function () {
  if ($(this).is(':focus')) {
    countFocus++;
    if (countFocus == 2) {
      this.blur();
      countFocus = 0;
    }
  }
});





$(document).ready(function () {
  $('.addtoc').on('click', function () {
    var button = $(this).closest('.commot');
    button.animate({position:"absolute"})
    var cart = $('#cartlength');
    var cartTotal = cart.attr('data-totalitems');
    // alert(cartTotal)
    var newCartTotal = parseInt(cartTotal) + 1;

    button.addClass('sendtocart');
    setTimeout(function () {
      button.removeClass('sendtocart');
      cart.addClass('shake').attr('data-totalitems', newCartTotal);
      setTimeout(function () {
        cart.removeClass('shake');
      }, 500);
    }, 1000);
  });
});