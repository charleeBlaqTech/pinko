(function ($) {
  'use strict';

  $(function () {
    $('.nav-settings').on('click', function () {
      $('#right-sidebar').toggleClass('open');
    });
    $('.settings-close').on('click', function () {
      $('#right-sidebar,#theme-settings').removeClass('open');
    });

    $('#settings-trigger').on('click', function () {
      $('#theme-settings').toggleClass('open');
    });

    $(document).ready(function () {
      $('.timestamp').html((index, html) => {
        const le = parseInt(html.length - 4)
        let without = html.slice(0,15);
        let ddd = without.replace('/', '.')
        let wcom = ddd.replace(","," ")
        let date = moment(wcom, 'DD.MM.YYYY HH:mm', true),
          now = moment(),
          days = now.diff(date, 'days'),
          weeks = now.diff(date, 'weeks'),
          result = wcom
        console.log(ddd + ' is date');

        if (weeks) {
          result += weeks + (weeks === 1 ? ' week ' : ' weeks ');
          days = days % 7;
        } else if (days || weeks === 0) {
          result += days + (days === 1 ? ' day' : ' days');
        }

        result += '<br />';
        return result;
      });
    });

    //background constants
    var navbar_classes =
      'navbar-danger navbar-success navbar-warning navbar-dark navbar-light navbar-primary navbar-info navbar-pink';
    var sidebar_classes = 'sidebar-light sidebar-dark';
    var $body = $('body');

    //sidebar backgrounds
    $('#sidebar-light-theme').on('click', function () {
      $body.removeClass(sidebar_classes);
      $body.addClass('sidebar-light');
      $('.sidebar-bg-options').removeClass('selected');
      $(this).addClass('selected');
    });
    $('#sidebar-dark-theme').on('click', function () {
      $body.removeClass(sidebar_classes);
      $body.addClass('sidebar-dark');
      $('.sidebar-bg-options').removeClass('selected');
      $(this).addClass('selected');
    });

    //Navbar Backgrounds
    $('.tiles.primary').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-primary');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.success').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-success');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.warning').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-warning');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.danger').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-danger');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.light').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-light');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.info').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-info');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.dark').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.navbar').addClass('navbar-dark');
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
    $('.tiles.default').on('click', function () {
      $('.navbar').removeClass(navbar_classes);
      $('.tiles').removeClass('selected');
      $(this).addClass('selected');
    });
  });
})(jQuery);
