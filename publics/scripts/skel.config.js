skel.init({
  reset: 'normalize',
  containers: '1080px',
  breakpoints: {
    large : {
      media: '(min-width: 1080px)',
      href : '/blog/publics/stylesheets/large.css'
    },
    medium: {
      media: '(min-width: 480px) and (max-width: 1080px)',
      containers : "720px",
      href : '/blog/publics/stylesheets/medium.css'
    },
    small: {
      media: '(max-width: 480px)',
      containers : "100%",
      href : '/blog/publics/stylesheets/small.css'
    }
  }
});