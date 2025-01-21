// 导航栏交互功能
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.getElementById('header-container');

  // 处理滚动效果
  if (header) {
    let lastScrollTop = 0;

    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // 下滑隐藏，上滑显示
      if (scrollTop === 0) {
        header.className = 'header-top';
      } else if (scrollTop > lastScrollTop) {
        header.className = 'header-hidden';
      } else {
        header.className = 'header-normal';
      }

      lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化时执行一次
  }

  // 处理移动端菜单
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // 点击导航菜单外部时关闭菜单
    document.addEventListener('click', function (event) {
      if (
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 处理菜单激活状态
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.nav-list a');

  // ... existing code ...

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');
    // 获取当前路径的基础部分（移除分页部分）
    let baseCurrentPath = currentPath.replace(/\/page\/\d+\/?$/, '/');

    // 精确匹配逻辑
    if (
      currentPath === href ||
      baseCurrentPath === href ||
      // 仅当 href 不是根路径且完全匹配时才激活
      (href !== '/Blog/' && href === baseCurrentPath)
    ) {
      link.classList.add('active');
    }
  });

  // ... existing code ...

  // 处理移动端菜单切换
  const menuToggleMobile = document.querySelector('.menu-toggle-mobile');
  const navMenuMobile = document.querySelector('.nav-menu-mobile');

  if (menuToggleMobile && navMenuMobile) {
    menuToggleMobile.addEventListener('click', () => {
      navMenuMobile.classList.toggle('active');

      // 切换菜单按钮的动画效果
      const spans = menuToggleMobile.querySelectorAll('span');
      spans.forEach((span) => span.classList.toggle('active'));
    });
  }
});
