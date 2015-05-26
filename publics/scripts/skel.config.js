skel.init({
  reset: 'normalize',
  containers: '1030px',
  breakpoints: {
    large : {
      media: '(min-width: 1030px)',
      href : '/blog/publics/stylesheets/large.css'
    },
    medium: {
      media: '(min-width: 480px) and (max-width: 1030px)',
      containers : "700px",
      href : '/blog/publics/stylesheets/medium.css'
    },
    small: {
      media: '(max-width: 480px)',
      containers : "100%",
      href : '/blog/publics/stylesheets/small.css'
    }
  }
});

skel.on('+small', function() {
    $(".box").css("width" ,"100%");
});