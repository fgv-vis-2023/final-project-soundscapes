document.addEventListener('DOMContentLoaded', function() {
    var scrollDownLink = document.querySelector('.scroll-down');

    scrollDownLink.addEventListener('click', function(e) {
      e.preventDefault();

      var section2 = document.getElementById('section2');
      var section2Top = section2.offsetTop;

      window.scrollTo({
        top: section2Top,
        behavior: 'smooth'
      });
    });
  });