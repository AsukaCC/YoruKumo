// 导航栏交互功能
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.getElementById('header-container');

  // 处理滚动效果
  if (header) {
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (navMenu && navMenu.classList.contains('active')) return;

      // 在 scrollTop <= 40 (即 10rem 轮播背景图最顶端区域内) 时，保持完全透明 (header-top)，高度保持统一的 4rem
      // 只有当滑出背景图顶部范围 (scrollTop > 40) 时，才切换成毛玻璃拟态背景 (header-normal)
      if (scrollTop <= 40) {
        header.className = 'header-top';
      } else {
        header.className = 'header-normal';
      }
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

      // 移动端菜单激活时，强制为 header-mobile（毛玻璃高斯模糊背景），确保菜单文本清晰可读
      // 菜单关闭时，立即执行 handleScroll 以恢复正确的滚动状态样式
      if (navMenu.classList.contains('active')) {
        header.className = 'header-mobile';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        handleScroll();
      }
    });

    // 点击导航菜单外部时关闭菜单
    document.addEventListener('click', function (event) {
      if (
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          handleScroll(); // 关闭时立即恢复正常的滚动状态样式
        }
      }
    });

    // 监听窗口大小变化，防呆处理：如果用户在移动端打开菜单后，将窗口拉大到桌面端，应自动重置状态
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        handleScroll();
      }
    });
  }

  // 处理菜单激活状态 (支持子目录及各种分页路由)
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const menuLinks = document.querySelectorAll('.nav-list a');
  const siteRoot = (window.SITE_CONFIG && window.SITE_CONFIG.root) || '/';
  const normalizedRoot = siteRoot.replace(/\/$/, '') || '/';

  menuLinks.forEach((link) => {
    // 获取绝对路径名并去尾部斜杠
    let linkPath = link.pathname.replace(/\/$/, '') || '/';
    
    // 检查 linkPath 是否是首页 (即只包含根路径或子目录根路径)
    const isRoot = linkPath === '/' || linkPath === normalizedRoot;
    
    if (isRoot) {
      // 只有当前路径也是根路径，或者当前路径是首页分页（如 /page/2 或 /Blog-YoruKumo/page/2）时才激活
      const escapedRoot = normalizedRoot.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const rootRegex = new RegExp('^' + (escapedRoot === '/' ? '' : escapedRoot) + '\/?(page\/\\d+\/?)?$');
      const testPath = window.location.pathname.replace(/\/$/, '') || '/';
      if (rootRegex.test(testPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else {
      // 对于其他页面链接，比如 /posts 或 /Blog-YoruKumo/posts
      // 我们检查当前路径是否等于 linkPath 或者是它的子路由 (如 /posts/xxxx)
      if (
        currentPath === linkPath ||
        currentPath.startsWith(linkPath + '/')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
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
