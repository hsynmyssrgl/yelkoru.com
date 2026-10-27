/* yelkoru.com — tek komut dosyası (sitenin kendi dosyası; dış kaynak yok, K-14).
   1) Görünüm seçici: Sistem · Açık · Koyu. Seçim yalnız bu tarayıcıda, kullanıcı seçtiğinde saklanır; çerez değildir.
   2) Açılır menüler: dışarı tıklayınca ya da Esc ile kapanır.
   Komut dosyası çalışmazsa site sistem görünümüyle eksiksiz çalışır; menüler <details> ile açılır. */
(function () {
  'use strict';
  var ANAHTAR = 'yelkoru-gorunum';
  var kok = document.documentElement;

  function oku() {
    try { return localStorage.getItem(ANAHTAR) || 'sistem'; } catch (e) { return 'sistem'; }
  }
  function uygula(secim) {
    if (secim === 'acik' || secim === 'koyu') { kok.setAttribute('data-gorunum', secim); }
    else { kok.removeAttribute('data-gorunum'); }
  }
  uygula(oku());

  document.addEventListener('DOMContentLoaded', function () {
    var gruplar = document.querySelectorAll('.s-gorunum');
    function isaretle(secim) {
      gruplar.forEach(function (g) {
        g.querySelectorAll('button').forEach(function (b) {
          b.setAttribute('aria-checked', b.getAttribute('data-gorunum') === secim ? 'true' : 'false');
        });
      });
    }
    gruplar.forEach(function (g) {
      g.hidden = false;
      g.addEventListener('click', function (olay) {
        var b = olay.target.closest('button[data-gorunum]');
        if (!b) { return; }
        var secim = b.getAttribute('data-gorunum');
        try {
          if (secim === 'sistem') { localStorage.removeItem(ANAHTAR); } else { localStorage.setItem(ANAHTAR, secim); }
        } catch (e) { /* saklanamazsa yalnız bu sayfada geçerli */ }
        uygula(secim);
        isaretle(secim);
      });
      /* Radyo grubu: ok tuşlarıyla gezinme */
      g.addEventListener('keydown', function (olay) {
        if (olay.key !== 'ArrowRight' && olay.key !== 'ArrowLeft') { return; }
        var dugmeler = Array.prototype.slice.call(g.querySelectorAll('button'));
        var i = dugmeler.indexOf(document.activeElement);
        if (i < 0) { return; }
        var j = (i + (olay.key === 'ArrowRight' ? 1 : dugmeler.length - 1)) % dugmeler.length;
        dugmeler[j].focus();
        dugmeler[j].click();
        olay.preventDefault();
      });
    });
    isaretle(oku());

    var acilirlar = document.querySelectorAll('.s-ust details');
    function kapat(haric) {
      acilirlar.forEach(function (d) { if (d !== haric) { d.open = false; } });
    }
    acilirlar.forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) { kapat(d); } });
    });
    document.addEventListener('click', function (olay) {
      if (!olay.target.closest('.s-ust details')) { kapat(null); }
    });
    document.addEventListener('keydown', function (olay) {
      if (olay.key !== 'Escape') { return; }
      acilirlar.forEach(function (d) {
        if (d.open) { d.open = false; d.querySelector('summary').focus(); }
      });
    });
  });
}());
