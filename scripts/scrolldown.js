document.addEventListener('DOMContentLoaded', function() {
  var scrollDownLinks = document.querySelectorAll('.scroll-down');

  scrollDownLinks.forEach(function(scrollDownLink) {
    scrollDownLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      var target = scrollDownLink.getAttribute('href');
      var targetElement = document.querySelector(target);
      var targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      console.log(targetTop);

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
});