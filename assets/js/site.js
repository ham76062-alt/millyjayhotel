
/* ============ Milly Jay Hotel & Event Center — site scripts ============ */
/* CENTRAL CONFIG — edit the numbers here and the whole site follows. */
var MILLYJAY = {
  name: 'Milly Jay Hotel & Event Center',
  phone: '053 153 0999',
  phoneIntl: '+233 53 153 0999',
  phoneHref: '0531530999',
  /* WhatsApp: this uses the hotel's published office line (053 153 0999).
     WhatsApp status is UNVERIFIED — no source confirms this number is on
     WhatsApp. The hotel must confirm it is the WhatsApp line before handover. */
  whatsappNumber: '233531530999',          /* 053 153 0999 in international format (no +) */
  whatsappDisplay: '053 153 0999',
  address: 'Sefwi Wiawso Punikrom, WG-1694-7430, Punikrom, Western North Region, Ghana',
  plusCode: '8FCV+CMQ',
  latitude: 6.3135625,
  longitude: -2.5023125,
  mapsUrl: 'https://maps.app.goo.gl/zBR14YZ2xwicFUaG7'
};

(function () {
  'use strict';

  /* ---- WhatsApp links (built from the one config above) ---- */
  function waLink(message) {
    var base = 'https://wa.me/' + MILLYJAY.whatsappNumber;
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.setAttribute('href', waLink(el.getAttribute('data-wa-msg') || ''));
  });

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Date minimums (no past dates) ---- */
  var today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function (inp) {
    inp.setAttribute('min', today);
  });

  /* ---- Shared form helpers ---- */
  function fmtDate(v) { return v || 'Not set'; }
  function wireForm(form, fields, validate, buildMessage) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = form.querySelector('.form-error');
      var f = {};
      fields.forEach(function (name) {
        f[name] = form.querySelector('[name="' + name + '"]');
      });
      function fail(msg) {
        err.textContent = msg;
        err.classList.add('show');
        err.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      err.classList.remove('show');
      var problem = validate(f);
      if (problem) { return fail(problem); }
      /* Open WhatsApp with the enquiry, then show the confirmation. */
      window.open(waLink(buildMessage(f)), '_blank');
      var fieldsEl = form.querySelector('.form-fields');
      var ok = form.querySelector('.form-ok');
      if (fieldsEl) { fieldsEl.style.display = 'none'; }
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    var again = form.querySelector('[data-again]');
    if (again) {
      again.addEventListener('click', function () {
        form.reset();
        var fieldsEl = form.querySelector('.form-fields');
        var ok = form.querySelector('.form-ok');
        if (fieldsEl) { fieldsEl.style.display = ''; }
        if (ok) { ok.classList.remove('show'); }
      });
    }
  }
  function needDate(f) {
    if (!f.checkin.value) { return 'Please choose a check-in date.'; }
    if (!f.checkout.value) { return 'Please choose a check-out date.'; }
    if (f.checkout.value <= f.checkin.value) { return 'Check-out must be after check-in.'; }
    return null;
  }

  /* ---- Room booking enquiry forms ---- */
  document.querySelectorAll('.booking-form').forEach(function (form) {
    wireForm(form,
      ['name', 'phone', 'email', 'room', 'checkin', 'checkout', 'adults', 'children', 'requests'],
      function (f) {
        if (!f.name.value.trim()) { return 'Please enter your full name.'; }
        if (!f.phone.value.trim()) { return 'Please enter your phone number so the hotel can reach you.'; }
        return needDate(f);
      },
      function (f) {
        return [
          'Hello Milly Jay Hotel, I would like to enquire about room availability and reservation.',
          '',
          'Name: ' + f.name.value.trim(),
          'Phone: ' + f.phone.value.trim(),
          'Email: ' + (f.email.value.trim() || 'Not given'),
          'Room: ' + f.room.value,
          'Check-in: ' + fmtDate(f.checkin.value),
          'Check-out: ' + fmtDate(f.checkout.value),
          'Adults: ' + f.adults.value,
          'Children: ' + f.children.value,
          'Special requests: ' + (f.requests.value.trim() || 'None')
        ].join('\n');
      });
  });

  /* ---- Event enquiry forms ---- */
  document.querySelectorAll('.event-form').forEach(function (form) {
    wireForm(form,
      ['name', 'phone', 'email', 'type', 'date', 'guests', 'requirements'],
      function (f) {
        if (!f.name.value.trim()) { return 'Please enter your full name.'; }
        if (!f.phone.value.trim()) { return 'Please enter your phone number so the hotel can reach you.'; }
        if (!f.type.value) { return 'Please choose an event type.'; }
        if (!f.date.value) { return 'Please choose your preferred event date.'; }
        return null;
      },
      function (f) {
        return [
          'Hello Milly Jay Hotel, I am interested in booking your event center. Please provide information about availability and pricing.',
          '',
          'Name: ' + f.name.value.trim(),
          'Phone: ' + f.phone.value.trim(),
          'Email: ' + (f.email.value.trim() || 'Not given'),
          'Event type: ' + f.type.value,
          'Preferred date: ' + fmtDate(f.date.value),
          'Estimated guests: ' + (f.guests.value.trim() || 'Not given'),
          'Additional requirements: ' + (f.requirements.value.trim() || 'None')
        ].join('\n');
      });
  });

  /* ---- Contact forms ---- */
  document.querySelectorAll('.contact-form').forEach(function (form) {
    wireForm(form,
      ['name', 'phone', 'email', 'message'],
      function (f) {
        if (!f.name.value.trim()) { return 'Please enter your full name.'; }
        if (!f.phone.value.trim()) { return 'Please enter your phone number so the hotel can reach you.'; }
        if (!f.message.value.trim()) { return 'Please write your message.'; }
        return null;
      },
      function (f) {
        return [
          'Hello Milly Jay Hotel, I would like to get in touch.',
          '',
          'Name: ' + f.name.value.trim(),
          'Phone: ' + f.phone.value.trim(),
          'Email: ' + (f.email.value.trim() || 'Not given'),
          'Message: ' + f.message.value.trim()
        ].join('\n');
      });
  });

  /* ---- Hero availability search -> feeds the booking form ---- */
  var searchForm = document.querySelector('.hero-search');
  if (searchForm) {
    searchForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var target = document.querySelector('#book');
      if (!target) { return; }
      var bookForm = target.querySelector('.booking-form') || document.querySelector('.booking-form');
      if (bookForm) {
        var map = { checkin: 'checkin', checkout: 'checkout', adults: 'adults', children: 'children' };
        Object.keys(map).forEach(function (k) {
          var src = searchForm.querySelector('[name="' + k + '"]');
          var dst = bookForm.querySelector('[name="' + map[k] + '"]');
          if (src && dst && src.value) { dst.value = src.value; }
        });
      }
      target.scrollIntoView({ behavior: 'smooth' });
      var nameField = bookForm && bookForm.querySelector('[name="name"]');
      if (nameField) { setTimeout(function () { nameField.focus({ preventScroll: true }); }, 700); }
    });
  }

  /* ---- "Book This Room" buttons ---- */
  document.querySelectorAll('[data-book-room]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var room = btn.getAttribute('data-book-room');
      var target = document.querySelector('#book');
      if (!target) { return; }
      var bookForm = target.querySelector('.booking-form') || document.querySelector('.booking-form');
      if (bookForm) {
        var sel = bookForm.querySelector('[name="room"]');
        if (sel) { sel.value = room; }
      }
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Room detail thumbnails ---- */
  var mainImg = document.querySelector('.room-detail .img-frame img');
  document.querySelectorAll('.thumb-row img').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      if (!mainImg) { return; }
      mainImg.src = thumb.getAttribute('data-full') || thumb.src;
      mainImg.alt = thumb.alt;
      document.querySelectorAll('.thumb-row img').forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });

  /* ---- Gallery filter + lightbox ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.masonry figure');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        it.style.display = (cat === 'all' || it.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    var figures = Array.prototype.slice.call(document.querySelectorAll('.masonry figure'));
    var current = 0;
    function visibleFigures() { return figures.filter(function (f) { return f.style.display !== 'none'; }); }
    function show(i) {
      var vis = visibleFigures();
      if (!vis.length) { return; }
      current = (i + vis.length) % vis.length;
      var img = vis[current].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = vis[current].querySelector('figcaption').textContent;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    figures.forEach(function (fig, i) {
      fig.addEventListener('click', function () { show(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) { close(); } });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) { return; }
      if (e.key === 'Escape') { close(); }
      if (e.key === 'ArrowLeft') { show(current - 1); }
      if (e.key === 'ArrowRight') { show(current + 1); }
    });
  }
})();

/* ---- Live preview expiry countdown (7 days) ---- */
(function () {
  /* Live preview expiry — change PREVIEW_EXPIRY to move the date, or remove
     the preview bar and this script to take the countdown off the site. */
  var PREVIEW_EXPIRY = new Date("2026-12-02T23:59:00Z");
  var bar = document.getElementById("previewBar");
  var expired = document.getElementById("previewExpired");
  /* Keep the sticky header sitting just below the countdown bar, whatever
     height the bar wraps to (desktop one line, mobile three). */
  function syncHeaderOffset() {
    var h = bar ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty("--preview-h", h + "px");
  }
  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset);
  function pad(n) { return String(n).padStart(2, "0"); }
  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = pad(v); }
  function tick() {
    var diff = PREVIEW_EXPIRY - Date.now();
    if (diff <= 0) {
      if (bar) bar.style.display = "none";
      if (expired) expired.hidden = false;
      syncHeaderOffset();
      return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    set("pvDays", d); set("pvHours", h); set("pvMins", m); set("pvSecs", s);
  }
  tick();
  setInterval(tick, 1000);
})();
