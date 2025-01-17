// 页面标题切换功能
(function () {
  // 这些变量会在 head.ejs 中通过 window 对象注入
  document.addEventListener('DOMContentLoaded', function () {
    const activeTitle = window.SITE_CONFIG.activeTitle;
    const inactiveTitle = window.SITE_CONFIG.inactiveTitle;

    document.addEventListener('visibilitychange', function () {
      document.title = document.hidden ? inactiveTitle : activeTitle;
    });
  });

  // 根据系统设置应用主题
  function updateTheme() {
    var theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  // 初始化时根据系统设置应用主题
  updateTheme();

  // 监听系统主题变化
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateTheme);
})();
