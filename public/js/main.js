(function ($) {
  window.onload = function () {
    // selecting the elements for which we want to add a tooltip
    const target = document.querySelectorAll('.tooltip-row');
    // const tooltip = document.getElementById('tooltip-text');
    const student = document.getElementById('tooltip-name');
    const tooltipstudent = 'tooltip-student';
    const school = 'tooltip-school';
    const classs = document.getElementById('tooltip-class');
    const shotby = document.getElementById('tooltip-shotby');

    target.forEach((el) => {
      // change display to 'block' on mouseover
      el.addEventListener(
        'mouseover',
        () => {
          // tooltip.style.display = 'block';
          student.style.display = 'block';
          const id = el.id.split('lla')[1];
          const jnkn = 'tooltip.innerHTML=(id)';
          const spec = `moment${id}`;
          const sid = `student${id}`;

          // tooltip.innerHTML=document.getElementById(spec).value
          student.innerHTML = document.getElementById(sid).value;
        },
        false
      );

      // change display to 'none' on mouseleave
      el.addEventListener(
        'mouseleave',
        () => {
          // tooltip.style.display = 'none';
          student.style.display = 'none';
        },
        false
      );
    });
  };


  // alert('jb');
  // const cbox =document.querySelectorAll('.toggle-checkbox')
  // const allmyg = document.querySelectorAll('.allmygsj');

  // let gees= []
  

  // for(let i = 0 ; i < allmyg.length ; i++){
  //   gees.push(allmyg[i].value);
    
  // }
  // // for(let i = 0 ; i < allmyg.length ; i++){
  // //   allmyg[i].value=""
    
  // // }

  // cbox.forEach(function(el,index){
    
  //   const myg = document.querySelectorAll('.allmygsj');
  //   // alert(index)
    

  //   el.addEventListener('change',function() {
      
  //     if (el.checked == true) {
  //       const yera = gees[index];
  //       myg[index].value = myg[index].value+"s"
        

  //       // alert(myg[index].value);
  //     } else {
  //       // alert('nchecked');

  //       const yera =  gees[index];
  //       myg[index].value = yera;
        
  //     }
  //   })

    



  // })


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

  // window.onload is optional since it depends on the way in which you fire events
  
})(jQuery);
