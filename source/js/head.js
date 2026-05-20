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

  // 将 MediaQueryList 的引用挂载到 window 全局对象，防止被 V8 引擎垃圾回收 (GC) 导致监听器失效
  window.themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // 根据系统设置应用主题
  function updateTheme() {
    var matches = window.themeMediaQuery.matches;
    var theme = matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  // 初始化时根据系统设置应用主题
  updateTheme();

  // 监听系统主题变化（包含旧版浏览器兼容）
  if (window.themeMediaQuery.addEventListener) {
    window.themeMediaQuery.addEventListener('change', updateTheme);
  } else if (window.themeMediaQuery.addListener) {
    window.themeMediaQuery.addListener(updateTheme);
  }


})();
