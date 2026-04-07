/* ========================================
   LAZY-VIDEO.JS — Load videos only when visible
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

  var videoObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var video = entry.target;
        var src = video.getAttribute('data-src');

        if (src && !video.src) {
          video.src = src;
          video.load();
          video.play().catch(function() {
            // Autoplay blocked — that's OK, user can interact
          });
          video.removeAttribute('data-src');
          video.classList.add('loaded');
        }

        videoObserver.unobserve(video);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '200px 0px' // Start loading 200px before visible
  });

  document.querySelectorAll('video[data-src]').forEach(function(video) {
    videoObserver.observe(video);
  });

});

/*
  Usage in HTML:

  <video
    class="lazy-video"
    data-src="assets/videos/demo.mp4"
    poster="assets/images/demo-poster.jpg"
    muted
    loop
    playsinline
  ></video>

  - poster shows immediately (no loading needed)
  - video src loads only when scrolled into view
  - muted + playsinline required for autoplay on mobile
*/
