(function ($) {
  'use strict';
  // alert('dfgh')
  // Dropdown on mouse hover
  $('.bod').each(function (el) {
    $(this).val(1);

    //   usero.push($(this).attr('data-x'))
  });
  let cartlegth = $('#cartlength').val();

  function tryr() {
    var sum = 0;

    $('.prices').each(function () {
      var currentRow = $(this).closest('tr');
      var button = parseFloat(currentRow.find('td:eq(3)').find('.inps').val());
      
      const price = parseFloat($(this).text())
      // alert(price)
      sum += ( price * button)

      //   usero.push($(this).attr('data-x'))
    });
    
    $('.totals').html(sum.toFixed(2));
    const vat = Math.ceil(0.1 * sum)
    $('.gross').val(sum.toFixed(2));

    $('.vat').html(vat.toFixed(2));
    $('.vati').val(vat.toFixed(2));
    const anse = (vat + sum).toFixed(2)
    $('.rtotal').html(anse);
    $('.ftotal').val(anse).toFixed(2)
    const throwd = document.querySelectorAll('.throws');
    if (anse == 0) {
      const throwl = document.getElementsByClassName("throws")
      throwl.style.disable = true;
      $("table").hide();
      // $(function() {
      //   window.location.href('/parent/db');
      // })
      // $('.leaver').slideToggle(360);
      // $('.bringit').slideToggle(470);
    }
  }
  $('.xtrows').click(function(){
    tryr();
    cartlegth = cartlegth --
    // alert(cartlegth);
  });

  

  
  $(document).ready(function () {
    const procceed = $('.vero');
    procceed.hide(500);
    $('.checkboxx').change(function (){
      var total = $("input[name='pics']:checked").length
      if(total > 0) {
        procceed.show(500);
        // alert(total);

      }
      else{
        procceed.hide(50);

      }
    })

  })
  
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

      button.parent().parent().find('input').val(newVal)

      tryr();
      

      
    });
  });
  tryr();
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
    $('.quantity button').each('click',function () {
      
    });
    $('.inps').each(function () {
      $(this).change(function () {
        tryr();
      });
    });
  });

  

  // Back to top button
  // $(window).scroll(function () {
  //     if ($(this).scrollTop() > 100) {
  //         $('.back-to-top').fadeIn('slow');
  //     } else {
  //         $('.back-to-top').fadeOut('slow');
  //     }
  // });
  // $('.back-to-top').click(function () {
  //     $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
  //     return false;
  // });

  // Vendor carousel
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
