(function ($) {
  'use strict';
  // alert('dfgh')
  // Dropdown on mouse hover
  $('.bod').each(function (el) {
    $(this).val(1);

    //   usero.push($(this).attr('data-x'))
  });
  let cartlegth = $('#cartlength').val();

  document.getElementsByClassName('dert').disable;

  const obosi = document.querySelectorAll('.obosi');
  obosi.forEach((ell) => {
    ell.style.display = 'none';
  });
  
  
  $(document).ready(function () {
    const supu = document.querySelectorAll('.checkboxx');
    const procceed = $('.vero');
    procceed.hide(500);

    supu.forEach((el) => {
      el.addEventListener('change', function () {
        const id = this.id.split('y')[1];
        // alert(id + ' idd');

        const uyu = document.getElementById('abc' + id);
        uyu.style.display = 'block';
        const vero = document.querySelectorAll('.obosi');

        if (el.checked == true) {
          uyu.name = 'opt';

          // alert(uyu.name);
        } else {
          // uyu.style.display = 'none';
          uyu.name = 'opthjvn';
          // alert('nchecked');

          // el.style.display = 'none';
        }

        var total = document.querySelectorAll(
          "input[name='pics']:checked"
        ).length;
        if (total > 0) {
          procceed.show(500);
          // alert(total);
        } else {
          procceed.hide(50);
        }
      });
    });
  });
  function tryr() {
    var sum = 0;
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    $('.prices').each(function () {
      var currentRow = $(this).closest('tr');
      var button = parseFloat(currentRow.find('td:eq(3)').find('.inps').val());

      const price = parseFloat($(this).text());
      // alert(price)
      sum += price * button;

      //   usero.push($(this).attr('data-x'))
    });

    $('.totals').html(sum.toLocaleString('en', options));
    const vat = parseInt($('.vato').val().toLocaleString('en', options));

    $('.vat').html(vat.toLocaleString('en', options));

    // const vat = Math.ceil(0.1 * sum);
    $('.gross').val(sum.toLocaleString('en', options));

    // $('.vat').html(vat.toLocaleString('en', options));
    // $('.vati').val(vat.toLocaleString('en', options));
    const anse = (vat + sum).toLocaleString('en', options);
    $('.rtotal').html(anse);
    $('.ftotal').val(anse).toLocaleString('en', options);
    const throwd = document.querySelectorAll('.throws');
    if (anse == 0) {
      const throwl = document.getElementsByClassName('throws');
      throwl.style.disable = true;
      $('table').hide();
      
    }
  }
  $('.xtrows').click(function () {
    tryr();
    cartlegth = cartlegth --;
    // alert(cartlegth);
  });

  

  $(document).ready(function () {
    $('.quantity button').on('click', function () {
      var button = $(this);
      var oldValue = button.parent().parent().find('input').val();
      if (button.hasClass('btn-plus')) {
        var newVal = parseFloat(oldValue) + 1;
        // alert('h');
        
      } else {
        if (oldValue > 1) {
          var newVal = parseFloat(oldValue) - 1;
        } else {
          newVal = 1;
        }
      }

      button.parent().parent().find('input').val(newVal);

      tryr();
    });
  });
  tryr();
  $(document).ready(function () {
    $('.xtrows').click(function () {
      const allem = $('.xtrows').length
      // alert(allem)
      if (allem>1){
        $(this).closest('tr').remove()
        const cartl = $("#cartlength").html()
        $('#cartlength').html(Number(cartl) - 1)
        $("#cartlength").html()
        tryr();
      }
      else{
        alert('OOps! you can not proceed with an empty cart' );

      }
    })
  })
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $('.navbar .dropdown')
          .on('mouseover', function () {
            $('.dropdown-toggle', this).trigger('click');
          })
          .on('mouseout', function () {
            $('.dropdown-toggle', this).trigger('click').blur();
          });
      } else {
        $('.navbar .dropdown').off('mouseover').off('mouseout');
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  $(document).ready(function () {
    $('.bringit').hide();

    $('.xtrows').click(function () {
      tryr();
    });
    $('.quantity button').each('click', function () {});
    $('.inps').each(function () {
      $(this).change(function () {
        tryr();
      });
    });
  });


  $('.vendor-carousel').owlCarousel({
    loop: true,
    margin: 29,
    nav: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 2,
      },
      576: {
        items: 3,
      },
      768: {
        items: 4,
      },
      992: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    },
  });

  // Related carousel
  $('.related-carousel').owlCarousel({
    loop: true,
    margin: 29,
    nav: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
    },
  });

  // Product Quantity
})(jQuery);
