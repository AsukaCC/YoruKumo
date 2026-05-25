// YoruKumo 主题 GSAP 动画核心控制脚本
document.addEventListener('DOMContentLoaded', function () {
  // 1. 获取全局注入的主题 GSAP 配置
  const config = (window.SITE_CONFIG && window.SITE_CONFIG.gsap) || {
    enable: true,
    entrance_stagger: 0.08,
    scroll_trigger: true,
    parallax: true,
    hover_effect: true
  };

  // 如果未启用 GSAP 或 GSAP 未加载，则添加 no-gsap 类并退出
  if (!config.enable || typeof gsap === 'undefined') {
    document.documentElement.classList.add('no-gsap');
    return;
  }

  // 注册 ScrollTrigger 插件
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    config.scroll_trigger = false;
    config.parallax = false;
  }

  // ==========================================
  // 2. 头部导航栏入场动画与交互
  // ==========================================
  const header = document.getElementById('header-container');
  if (header) {
    // 导航链接与 Logo 的 Hover 微交互
    if (config.hover_effect) {
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, { scale: 1.05, duration: 0.3, ease: 'back.out(2.5)' });
        });
        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      }

      const navLinks = document.querySelectorAll('.nav-list a');
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, { y: -2, color: 'var(--secondary-text-color)', duration: 0.25, ease: 'power1.out' });
        });
        link.addEventListener('mouseleave', () => {
          gsap.to(link, { y: 0, color: 'var(--text-color)', duration: 0.25, ease: 'power1.out' });
        });
      });
    }
  }


  // ==========================================
  // 3. 轮播图 / Banner (Swiper) Parallax 视差与入场
  // ==========================================
  const swiperImg = document.querySelector('#swiper-container img');
  if (swiperImg) {
    // 首屏大图缩放缓动入场
    gsap.fromTo(swiperImg,
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: 'power3.out' }
    );

    // 视差滚动效果
    if (config.parallax) {
      gsap.to(swiperImg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#swiper-container',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  // ==========================================
  // 4. 列表与内容卡片进场动画 (Stagger & ScrollTrigger)
  // ==========================================
  // 获取所有需要渐现的组件元素
  const animItems = gsap.utils.toArray('.timeline-item, .timeline-year-node, .post-list:not(.timeline-wrapper) > a > .postItem, .post-year, .tag-post-item, .tag-item, .page-title h2');
  
  if (animItems.length > 0) {
    const initialItems = [];
    const scrollItems = [];

    // 分离当前视口内和视口外的元素
    const viewportHeight = window.innerHeight;
    animItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      // 如果元素顶部在视口高度内，则归为首屏元素
      if (rect.top < viewportHeight - 50) {
        initialItems.push(item);
      } else {
        scrollItems.push(item);
      }
    });

    // 4.1 首屏元素：Stagger 进场
    if (initialItems.length > 0) {
      gsap.fromTo(initialItems,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, stagger: config.entrance_stagger, ease: 'power2.out', delay: 0.3 }
      );
    }

    // 4.2 视口外元素：随着滚动使用 ScrollTrigger 渐显
    if (config.scroll_trigger && scrollItems.length > 0) {
      scrollItems.forEach(item => {
        gsap.fromTo(item,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%', // 当元素顶部到达视口 90% 时触发
              toggleActions: 'play none none none'
            }
          }
        );
      });
    } else if (scrollItems.length > 0) {
      // 如果未开启 ScrollTrigger，则在首屏加载完后统一渐显
      gsap.fromTo(scrollItems,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.7, stagger: config.entrance_stagger, ease: 'power2.out', delay: 0.6 }
      );
    }
  }

  // ==========================================
  // 5. 卡片 Hover GSAP 交互效果
  // ==========================================
  if (config.hover_effect) {
    const cards = document.querySelectorAll('.postItem, .tag-item, .tag-detail .tag-post-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        gsap.to(card, {
          y: -6,
          scale: 1.015,
          boxShadow: '0 10px 25px var(--shadow-color)',
          backgroundColor: 'var(--main-color)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // 如果有标签，对其进行微缩放
        const tags = card.querySelectorAll('.postItem-tag');
        if (tags.length > 0) {
          gsap.to(tags, {
            backgroundColor: 'var(--secondary-color)',
            duration: 0.3,
            stagger: 0.02
          });
        }

        // 联动时间线小圆点 (Timeline Dot) Hover 效果
        const timelineItem = card.closest('.timeline-item');
        if (timelineItem) {
          const dot = timelineItem.querySelector('.timeline-dot');
          if (dot) {
            gsap.to(dot, {
              backgroundColor: 'var(--text-color)',
              scale: 1.3,
              boxShadow: '0 0 12px var(--text-color)',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 2px 8px var(--shadow-color)',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out'
        });

        // 标签颜色恢复
        const tags = card.querySelectorAll('.postItem-tag');
        if (tags.length > 0) {
          gsap.to(tags, {
            backgroundColor: 'var(--main-color)',
            duration: 0.3
          });
        }

        // 恢复时间线小圆点 (Timeline Dot) 初始状态
        const timelineItem = card.closest('.timeline-item');
        if (timelineItem) {
          const dot = timelineItem.querySelector('.timeline-dot');
          if (dot) {
            gsap.to(dot, {
              backgroundColor: 'var(--secondary-text-color)',
              scale: 1,
              boxShadow: '0 0 6px var(--shadow-color1)',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
      });
    });
  }

  // ==========================================
  // 6. 关于页面信息项高定动效 (About Page Premium Animations)
  // ==========================================
  const aboutMain = document.querySelector('.about-main');
  if (aboutMain) {
    // 6.1 专属瀑布式入场时间轴 (Entrance Timeline)
    const tl = gsap.timeline({ delay: 0.2 });

    // 1. 头像弹性回弹入场
    const avatar = document.querySelector('.about-avatar');
    if (avatar) {
      tl.fromTo(avatar,
        { scale: 0.4, opacity: 0, rotation: -12 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' }
      );
    }

    // 2. 博主姓名渐现上升
    const name = document.querySelector('.about-name');
    if (name) {
      tl.fromTo(name,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.8' // 与头像动画重合，使入场节奏紧凑高级
      );
    }

    // 3. 个人描述渐现上升
    const desc = document.querySelector('.about-description');
    if (desc) {
      tl.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.5'
      );
    }

    // 4. 信息胶囊卡片瀑布式阶梯滑入
    const infoItems = document.querySelectorAll('.about-links h3, .about-links .link-item');
    if (infoItems.length > 0) {
      tl.fromTo(infoItems,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      );
    }

    // 6.2 信息胶囊卡片 Hover 磁性微交互 (Hover Micro-interactions)
    if (config.hover_effect) {
      const linkItems = document.querySelectorAll('.about-links .link-item');
      linkItems.forEach(item => {
        const icon = item.querySelector('.icon');
        const text = item.querySelector('span, a');

        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            x: 8,
            scale: 1.03,
            backgroundColor: 'var(--secondary-color)',
            borderColor: 'var(--primary-color)',
            boxShadow: '0 6px 15px var(--shadow-color1)',
            duration: 0.3,
            ease: 'power2.out'
          });
          if (icon) {
            gsap.to(icon, {
              scale: 1.15,
              rotation: 12,
              color: 'var(--primary-color)',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
          if (text) {
            gsap.to(text, {
              color: 'var(--primary-color)',
              opacity: 1,
              duration: 0.3
            });
          }
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            x: 0,
            scale: 1,
            backgroundColor: 'var(--main-color)',
            borderColor: 'rgba(128, 128, 128, 0.1)',
            boxShadow: '0 4px 10px var(--shadow-color2)',
            duration: 0.3,
            ease: 'power2.out'
          });
          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              color: 'var(--text-color)',
              duration: 0.3,
              ease: 'power2.out'
            });
          }
          if (text) {
            gsap.to(text, {
              color: 'var(--text-color)',
              opacity: 0.8,
              duration: 0.3
            });
          }
        });
      });
    }
  }

  // ==========================================
  // 7. 按钮与文本链接悬浮交互优化
  // ==========================================
  if (config.hover_effect) {
    // 7.1 返回顶部与标签开关按钮：磁性吸引与弹性反馈效果 (Magnetic Hover)
    const magneticButtons = document.querySelectorAll('.to-top, .tag-toggle-btn');
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        // 获取按钮的中心坐标
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        
        // 计算鼠标相对于按钮中心的位移
        const distX = e.clientX - btnX;
        const distY = e.clientY - btnY;
        
        // 磁性吸引系数 (0.3) 并限制在较小位移内以保证手感
        gsap.to(btn, {
          x: distX * 0.3,
          y: distY * 0.3,
          scale: 1.1,
          boxShadow: '0 8px 20px var(--shadow-color1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', function () {
        // 鼠标移出时，产生丝滑的回弹复位
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          boxShadow: '0 0 1rem var(--shadow-color1)',
          duration: 0.6,
          ease: 'elastic.out(1.2, 0.4)'
        });
      });
    });

    // 7.2 分页按钮悬停图标平移与缩放 (Pagination Hover)
    const pagItems = document.querySelectorAll('.pagination-item:not(.disabled)');
    pagItems.forEach(item => {
      const icon = item.querySelector('.pagination-icon');
      const isPrev = item.classList.contains('prev');
      
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.1, backgroundColor: 'var(--main-color)', duration: 0.25, ease: 'power2.out' });
        if (icon) {
          gsap.to(icon, { x: isPrev ? -3 : 3, duration: 0.25, ease: 'power2.out' });
        }
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, backgroundColor: 'transparent', duration: 0.25, ease: 'power2.out' });
        if (icon) {
          gsap.to(icon, { x: 0, duration: 0.25, ease: 'power2.out' });
        }
      });
    });

    // 7.3 文章内页上一篇/下一篇文字悬停提升 (Post Nav Hover)
    const postNavPrev = document.querySelector('.post-nav-prev');
    if (postNavPrev) {
      const prevLink = postNavPrev.querySelector('a');
      const prevIcon = postNavPrev.querySelector('i');
      postNavPrev.addEventListener('mouseenter', () => {
        if (prevIcon) gsap.to(prevIcon, { x: -5, color: 'var(--text-color)', duration: 0.3, ease: 'power2.out' });
        if (prevLink) gsap.to(prevLink, { x: -2, color: 'var(--text-color)', duration: 0.3, ease: 'power2.out' });
      });
      postNavPrev.addEventListener('mouseleave', () => {
        if (prevIcon) gsap.to(prevIcon, { x: 0, color: 'var(--secondary-text-color)', duration: 0.3, ease: 'power2.out' });
        if (prevLink) gsap.to(prevLink, { x: 0, color: 'var(--secondary-text-color)', duration: 0.3, ease: 'power2.out' });
      });
    }

    const postNavNext = document.querySelector('.post-nav-next');
    if (postNavNext) {
      const nextLink = postNavNext.querySelector('a');
      const nextIcon = postNavNext.querySelector('i');
      postNavNext.addEventListener('mouseenter', () => {
        if (nextIcon) gsap.to(nextIcon, { x: 5, color: 'var(--text-color)', duration: 0.3, ease: 'power2.out' });
        if (nextLink) gsap.to(nextLink, { x: 2, color: 'var(--text-color)', duration: 0.3, ease: 'power2.out' });
      });
      postNavNext.addEventListener('mouseleave', () => {
        if (nextIcon) gsap.to(nextIcon, { x: 0, color: 'var(--secondary-text-color)', duration: 0.3, ease: 'power2.out' });
        if (nextLink) gsap.to(nextLink, { x: 0, color: 'var(--secondary-text-color)', duration: 0.3, ease: 'power2.out' });
      });
    }

    // 7.4 "查看全部"文字及右向箭头悬停平移 (View-All Link Hover)
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    viewAllLinks.forEach(link => {
      const arrow = link.querySelector('i');
      const text = link.querySelector('span');
      link.addEventListener('mouseenter', () => {
        if (arrow) gsap.to(arrow, { x: 5, duration: 0.25, ease: 'power2.out' });
        if (text) gsap.to(text, { color: 'var(--secondary-text-color)', duration: 0.25 });
      });
      link.addEventListener('mouseleave', () => {
        if (arrow) gsap.to(arrow, { x: 0, duration: 0.25, ease: 'power2.out' });
        if (text) gsap.to(text, { color: 'var(--text-color)', duration: 0.25 });
      });
    });
  }
});

