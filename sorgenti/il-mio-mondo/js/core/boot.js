/* ================= AVVIO ================= */
(function boot() {
  const saved = store.get('tab', 'home');
  current = TABS.some(t => t[0] === saved) ? saved : 'home';
  if (!D) {
    current = 'home';
    D = { name: MASCOTTE === 'avatar' ? 'avatar' : 'il tuo drago', color: 'verde', energy: 0 };
    renderTabs(); updateBar();
    PAGES.home($('p-home'));
    D = null;
    onboarding(false);
  } else {
    updateBar(); go(current);
    /* chi aveva già il drago sceglie una volta l'avatar: i progressi restano */
    if (MASCOTTE === 'avatar' && !D.avatar) setTimeout(() => { if (!$('modal') || $('modal').hidden !== false) onboarding(true); }, 1200);
  }
})();
