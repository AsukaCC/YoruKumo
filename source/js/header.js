// 导航栏交互功能
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      menuToggle.setAttribute(
        'aria-expanded',
        menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
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
});
