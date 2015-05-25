skel.init({
  reset: 'normalize',
  containers: '1024px',
  breakpoints: {
    large : {
      media: '(min-width: 1024px)',
      href : '/blog/publics/stylesheets/large.css'
    },
    medium: {
      media: '(min-width: 480px) and (max-width: 1024px)',
      containers : "769px",
      href : '/blog/publics/stylesheets/medium.css'
    },
    small: {
      media: '(max-width: 480px)',
      containers : "100%",
      href : '/blog/publics/stylesheets/small.css'
    }
  }
});