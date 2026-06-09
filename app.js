/* ===== Pitch Marketing — interacciones ===== */
(function () {
  window.__WA = window.__WA || '56931977929';

  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
      });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  document.querySelectorAll('.soundwave').forEach(function (wave) {
    var bars = parseInt(wave.getAttribute('data-bars') || '26', 10);
    var frag = document.createDocumentFragment();
    for (var i = 0; i < bars; i++) {
      var b = document.createElement('span');
      b.className = 'bar';
      var dur = (0.85 + Math.random() * 0.95).toFixed(2);
      var delay = (-Math.random() * 1.6).toFixed(2);
      b.style.animationDuration = dur + 's';
      b.style.animationDelay = delay + 's';
      var h = (18 + Math.random() * 82).toFixed(0);
      b.style.height = h + '%';
      frag.appendChild(b);
    }
    wave.appendChild(frag);
  });

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  var form = document.getElementById('applyForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = (form.nombre.value || '').trim();
      var tel = (form.telefono.value || '').trim();
      var region = form.region.value || '';
      var msg = (form.mensaje.value || '').trim();
      var texto = '¡Hola Pitch Marketing! Quiero postular al equipo.\n\nNombre: ' + nombre + '\nTeléfono: ' + tel + '\nRegión: ' + region + (msg ? '\n\nMensaje: ' + msg : '');
      var num = (window.__WA || '').replace(/\D/g, '');
      var url = num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(texto) : 'https://instagram.com/pitch_marketing_chile';
      window.open(url, '_blank', 'noopener');
      var success = document.getElementById('formSuccess');
      var fields = document.getElementById('formFields');
      if (success && fields) { fields.style.display = 'none'; success.classList.add('show'); }
    });
  }
})();

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.getElementById('scrollProgress');
  var parEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var bbLogo = document.querySelector('.bb-logo');

  function onProgress() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = p + '%';
  }

  function onParallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    parEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var center = r.top + r.height / 2;
      var delta = (center - vh / 2) / vh;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      el.style.transform = 'translate3d(0,' + (delta * speed * 100).toFixed(1) + 'px,0)';
    });
  }

  function onBrand() {
    if (!bbLogo || reduce) return;
    var r = bbLogo.getBoundingClientRect();
    var vh = window.innerHeight;
    var dist = Math.abs((r.top + r.height / 2) - vh / 2);
    var prog = 1 - Math.min(1, Math.max(0, dist / (vh * 0.7)));
    bbLogo.style.transform = 'scale(' + (0.82 + prog * 0.18).toFixed(3) + ')';
    bbLogo.style.opacity = (0.4 + prog * 0.6).toFixed(2);
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () { onProgress(); onParallax(); onBrand(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  function runCounts() {
    document.querySelectorAll('.cnt').forEach(function (el) {
      var to = parseInt(el.getAttribute('data-to'), 10);
      if (reduce) { el.textContent = to; return; }
      var dur = 1500, start = null;
      function tick(now) {
        if (!start) start = now;
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased);
        if (p < 1) window.requestAnimationFrame(tick);
        else el.textContent = to;
      }
      window.requestAnimationFrame(tick);
    });
  }
  var statsSection = document.querySelector('.stats');
  if (statsSection) {
    var counted = false;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !counted) { counted = true; runCounts(); } });
    }, { threshold: 0.4 });
    cio.observe(statsSection);
  }
})();