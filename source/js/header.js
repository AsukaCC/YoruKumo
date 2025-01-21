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

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');
    // 改进路径匹配逻辑，避免首页链接在其他页面被错误激活
    if (
      currentPath === href ||
      (href !== '/' &&
        currentPath.startsWith(href) &&
        // 确保当前路径后面紧跟着 '/' 或者已经结束
        (currentPath.length === href.length ||
          currentPath[href.length] === '/'))
    ) {
      link.classList.add('active');
    }
  });

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
