/* =========================================================
   Nishit Kumar — Portfolio
   Vanilla JS: preloader, cursor, nav, reveals, projects,
   magnetic buttons, contact form.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- Preloader ---------------- */
  (function preloader() {
    var el = document.getElementById('preloader');
    var fill = document.getElementById('preloaderFill');
    var pct = document.getElementById('preloaderPct');
    if (!el) return;

    if (reduceMotion) {
      el.classList.add('done');
      el.setAttribute('aria-hidden', 'true');
      setTimeout(function () { el.style.display = 'none'; }, 50);
      return;
    }

    var progress = 0;
    var timer = setInterval(function () {
      progress = Math.min(100, progress + Math.floor(Math.random() * 16) + 6);
      fill.style.width = progress + '%';
      pct.textContent = progress + '%';
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(function () {
          el.classList.add('done');
          setTimeout(function () { el.style.display = 'none'; }, 850);
        }, 350);
      }
    }, 110);
  })();

  /* ---------------- Custom cursor ---------------- */
  (function cursor() {
    if (isTouch) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      dot.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 4) + 'px)';
      rx = e.clientX; ry = e.clientY;
      ring.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px)';
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      var isInteractive = t.closest && (t.closest('a') || t.closest('button') || t.closest('.magnetic') || t.closest('input') || t.closest('textarea'));
      ring.classList.toggle('hover', !!isInteractive);
    });
  })();

  /* ---------------- Navbar ---------------- */
  (function nav() {
    var navEl = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!navEl) return;

    var onScroll = function () {
      navEl.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && menu) {
      var closeMenu = function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };
      toggle.addEventListener('click', function () {
        var willOpen = !menu.classList.contains('open');
        menu.classList.toggle('open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
        document.body.style.overflow = willOpen ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }
  })();

  /* ---------------- Hero rotating role text ---------------- */
  (function heroRoles() {
    var el = document.getElementById('roleText');
    if (!el) return;
    var roles = ['Data Scientist', 'ML Engineer', 'GenAI / Agentic AI Developer', 'Software Engineer'];
    var i = 0;

    function render(text) {
      // Wrap "/" in an accent-colored span so multi-word roles pop, e.g. "GenAI / Agentic AI Developer"
      el.innerHTML = text.split(' / ').join(' <span class="role-slash">/</span> ');
    }
    render(roles[0]);

    if (reduceMotion) return;

    setInterval(function () {
      i = (i + 1) % roles.length;

      // 1) slide the current role up and out
      el.classList.add('role-exit');

      setTimeout(function () {
        // 2) swap text, jump it below the baseline with transitions off
        render(roles[i]);
        el.classList.remove('role-exit');
        el.classList.add('role-enter-prep');

        // force a reflow so the "prep" position is committed before we animate
        void el.offsetHeight;

        // 3) re-enable transitions and slide it up into place
        requestAnimationFrame(function () {
          el.classList.remove('role-enter-prep');
        });
      }, 550);
    }, 2800);
  })();

  /* ---------------- Scroll cue ---------------- */
  (function scrollCue() {
    var btn = document.getElementById('scrollCue');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  })();

  /* ---------------- Scroll reveal ---------------- */
  (function reveals() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Tech marquee ---------------- */
  (function marquee() {
    var track = document.getElementById('marqueeTrack');
    if (!track) return;
    var stack = ['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'FAISS', 'Scikit-learn', 'SQL', 'C++', 'Hugging Face'];
    var loopStack = stack.concat(stack); // duplicate for seamless loop
    track.innerHTML = loopStack.map(function (t) {
      return '<span>' + t + ' <em>&#10022;</em></span>';
    }).join('');
  })();

  /* ---------------- Projects filter ---------------- */
  (function projects() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.pcard');
    var viewport = document.getElementById('projectsViewport');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.hidden = !show;
        });
        if (viewport) viewport.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  })();

  /* ---------------- Magnetic buttons ---------------- */
  (function magnetic() {
    if (isTouch || reduceMotion) return;
    var els = document.querySelectorAll('.magnetic');
    els.forEach(function (el) {
      var strength = 0.25;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
        el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
        setTimeout(function () { el.style.transition = ''; }, 400);
      });
    });
  })();

  /* ---------------- Back to top ---------------- */
  (function toTop() {
    var btn = document.getElementById('toTop');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------------- Footer year ---------------- */
  (function year() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  })();

  /* ---------------- Contact form (EmailJS) ---------------- */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    var sendBtn = document.getElementById('sendBtn');
    var sendBtnText = document.getElementById('sendBtnText');
    var status = document.getElementById('formStatus');
    if (!form) return;

    var EMAILJS_PUBLIC_KEY = 'UgzvjTLKq41z3BzGG';
    var EMAILJS_SERVICE_ID = 'service_5fvh29m';
    var EMAILJS_TEMPLATE_ID = 'template_p7i5m0h';

    function setStatus(msg, type) {
      status.textContent = msg;
      status.className = 'form-status' + (type ? ' ' + type : '');
    }

    function initEmailJS() {
      if (window.emailjs && !window.__emailjsInit) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
        window.__emailjsInit = true;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      initEmailJS();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        setStatus('Please fill in all fields before sending.', 'err');
        return;
      }
      if (!emailRegex.test(email)) {
        setStatus('Please enter a valid email address.', 'err');
        return;
      }
      if (!window.emailjs) {
        setStatus('Could not connect to the email service. Please email me directly.', 'err');
        return;
      }

      sendBtn.disabled = true;
      sendBtnText.textContent = 'Sending...';
      setStatus('', '');

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message
      }).then(function () {
        sendBtnText.textContent = 'Send Message';
        sendBtn.disabled = false;
        setStatus('Message sent — thanks for reaching out! I\u2019ll get back to you soon.', 'ok');
        form.reset();
      }).catch(function (error) {
        console.error('EmailJS error:', error);
        sendBtnText.textContent = 'Send Message';
        sendBtn.disabled = false;
        setStatus('Something went wrong. Please try again or email me directly.', 'err');
      });
    });
  })();

})();
