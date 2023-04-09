(function ($) {
  // alert('jb');
  $('.pictures').hide(100);
  $('.allpicturess').css({ color: 'white' });
  $('.personals').hide(100);

  $('.live').click(function () {
    $('.live').css({ color: 'white' });
    $('.allpicturess').css({ color: 'black' });
    $('.personalss').css({ color: 'black' });

    const pict = $('.pict');

    if (pict.length > 0) {
      $('.relad').fadeIn(600);
    } else {
      $('.relad').hide();
    }

    $('.allpictures').hide();
    $('.personals').hide();
    $('.pictures').show();
  });
  $('.personalss').click(function () {
    $('.live').css({ color: 'black' });
    $('.allpicturess').css({ color: 'black' });
    $('.personalss').css({ color: 'white' });

    const person = $('.person');

    if (person.length > 0) {
      $('.relad').fadeIn(600);
    } else {
      $('.relad').hide();
    }

    $('.allpictures').hide();
    $('.personals').show();
    $('.pictures').hide();
  });
  $('.allpicturess').click(function () {
    $('.live').css({ color: 'black' });
    $('.allpicturess').css({ color: 'white' });
    $('.personalss').css({ color: 'black' });

    const allp = $('.allp');

    if (allp.length > 0) {
      $('.relad').fadeIn(600);
    } else {
      $('.relad').hide();
    }

    $('.allpictures').show();
    $('.personals').hide();
    $('.pictures').hide();
  });

  function tofix() {
    const tofixed = document.querySelectorAll('.tofix');
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    tofixed.forEach((el) => {
      const answer = Number(el.innerHTML).toLocaleString('en', options);
      el.innerHTML = answer.toLocaleString('en', options);
    });
  }
  tofix();
  const pict = $('.pict');
  const allp = $('.allp');
  const person = $('.person');
  if (person.length > 0 || pict.length > 0 || allp.length > 0) {
    $('.relad').fadeIn(600);
  } else {
    $('.relad').hide();
  }
  $('.remova').toggle();

  $('.relad').click(function () {
    $('.remova').toggle();
  });

  ('use strict');

  var fullHeight = function () {
    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function () {
      $('.js-fullheight').css('height', $(window).height());
    });
  };
  fullHeight();

  var carousel = function () {
    $('.featured-carousel').owlCarousel({
      loop: true,
      autoplay: true,
      margin: 30,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      nav: true,
      dots: true,
      autoplayHoverPause: false,
      items: 1,
      navText: [
        "<span class='ion-ios-arrow-back'></span>",
        "<span class='ion-ios-arrow-forward'></span>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  };
  carousel();
})(jQuery);
