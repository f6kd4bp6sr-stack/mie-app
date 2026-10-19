/* ================= AVVIO ================= */
(function boot() {
  const saved = store.get('tab', 'home');
  current = TABS.some(t => t[0] === saved) ? saved : 'home';
  if (!D) {
    current = 'home';
    D = { name: 'il tuo drago', color: 'verde', energy: 0 };
    renderTabs(); updateBar();
    PAGES.home($('p-home'));
    D = null;
    onboarding(false);
  } else {
    updateBar(); go(current);
  }
})();
