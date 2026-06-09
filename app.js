(function () {
  /* NAV SCROLL */
  var nav = document.getElementById('nav');
  function onNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var bar = document.getElementById('scrollProgress');
    if (bar) bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* MOBILE MENU */
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

  /* REVEAL ON SCROLL */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ANIMATED COUNTERS */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function runCounters(container) {
    container.querySelectorAll('.cnt').forEach(function (el) {
      var to = parseInt(el.getAttribute('data-to'), 10);
      if (reduce) { el.textContent = to; return; }
      var dur = 1600, start = null;
      function tick(now) {
        if (!start) start = now;
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = to;
      }
      requestAnimationFrame(tick);
    });
  }
  var countedSections = new Set();
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !countedSections.has(e.target)) {
        countedSections.add(e.target);
        runCounters(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats, .resultados-section').forEach(function (s) { cio.observe(s); });

  /* FAQ ACCORDION */
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

  /* CONTACT FORM → WHATSAPP */
  var form = document.getElementById('applyForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = (form.nombre.value || '').trim();
      var empresa = (form.empresa ? form.empresa.value || '' : '').trim();
      var tel = (form.telefono.value || '').trim();
      var email = (form.email ? form.email.value || '' : '').trim();
      var servicio = (form.servicio ? form.servicio.value || '' : '').trim();
      var msg = (form.mensaje.value || '').trim();
      var texto = '¡Hola Estrategia Digital! Solicito una asesoría gratuita.\n\n'
        + 'Nombre: ' + nombre
        + (empresa ? '\nEmpresa: ' + empresa : '')
        + '\nTeléfono: ' + tel
        + (email ? '\nCorreo: ' + email : '')
        + (servicio ? '\nServicio de interés: ' + servicio : '')
        + (msg ? '\n\nMensaje: ' + msg : '');
      window.open('https://wa.me/56931977929?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      var success = document.getElementById('formSuccess');
      var fields = document.getElementById('formFields');
      if (success && fields) { fields.style.display = 'none'; success.classList.add('show'); }
    });
  }

  /* PORTFOLIO TABS */
  var portTabs = document.querySelectorAll('.port-tab');
  var portCards = document.querySelectorAll('.port-card');
  portTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      portTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.getAttribute('data-tab');
      portCards.forEach(function (card) {
        var cat = card.getAttribute('data-cat');
        var show = filter === 'todos' || cat === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* BUDGET CALCULATOR */
  var calcItems = document.querySelectorAll('.calc-item');
  var totalMensualEl = document.getElementById('calcTotalMensual');
  var totalUnicoEl = document.getElementById('calcTotalUnico');

  function formatCLP(n) {
    if (n === 0) return '$0';
    return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function updateCalc() {
    var mensual = 0, unico = 0;
    calcItems.forEach(function (item) {
      if (item.classList.contains('selected')) {
        var price = parseInt(item.getAttribute('data-price'), 10);
        var type = item.getAttribute('data-type');
        if (type === 'mensual') mensual += price;
        else unico += price;
      }
    });
    if (totalMensualEl) totalMensualEl.textContent = formatCLP(mensual);
    if (totalUnicoEl) totalUnicoEl.textContent = formatCLP(unico);
  }

  calcItems.forEach(function (item) {
    item.addEventListener('click', function () {
      item.classList.toggle('selected');
      updateCalc();
    });
  });

  /* CHAT WIDGET */
  var chatWidget = document.getElementById('chatWidget');
  var chatToggle = document.getElementById('chatToggle');
  var chatMessages = document.getElementById('chatMessages');
  var chatOpts = document.getElementById('chatOpts');

  var chatReplies = {
    'Ver servicios': 'Ofrecemos: 📱 Gestión de Instagram, 🔍 Posicionamiento, 🤖 Automatización con IA, 📅 Agendamiento, 🌐 Sitios Web, Landing Pages y 🛒 Tiendas Online.',
    'Precios': 'Los precios van desde $50.000/mes para servicios básicos. Usa nuestra calculadora de presupuesto o solicita una cotización personalizada gratis. 👆',
    'Asesoría gratuita': '¡Perfecto! Te contactamos por WhatsApp para coordinar. Haz clic aquí para chatear ahora 👉',
    'Otra consulta': '¡Claro! Escríbenos por WhatsApp y te respondemos de inmediato. Somos rápidos 🚀'
  };

  if (chatToggle) {
    chatToggle.addEventListener('click', function () {
      chatWidget.classList.toggle('open');
    });
  }

  if (chatOpts) {
    chatOpts.addEventListener('click', function (e) {
      var btn = e.target.closest('.chat-opt');
      if (!btn) return;
      var msg = btn.getAttribute('data-msg');

      var userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.innerHTML = '<p>' + msg + '</p>';
      chatMessages.appendChild(userMsg);

      setTimeout(function () {
        var botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        var reply = chatReplies[msg] || 'Contáctanos por WhatsApp para más información.';
        botMsg.innerHTML = '<p>' + reply + '</p>';
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (msg === 'Asesoría gratuita' || msg === 'Otra consulta') {
          setTimeout(function () {
            window.open('https://wa.me/56931977929?text=Hola%20Estrategia%20Digital!%20Me%20gustar%C3%ADa%20una%20asesor%C3%ADa%20gratuita.', '_blank', 'noopener');
          }, 800);
        }
      }, 600);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
})();
