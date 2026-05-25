// Premium Interactive Image Viewer with bottom Toolbar, rotation, ESC closing, mouse/touch zooming & panning
document.addEventListener('DOMContentLoaded', function () {
  // 核心交互状态
  let scale = 1.0;
  let offsetX = 0;
  let offsetY = 0;
  let rotation = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  // 事件委托：监听所有已加载的懒加载图片点击
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('lazy-image') && target.classList.contains('loaded')) {
      openImageViewer(target.src, target.alt || '');
    }
  });

  function updateImageTransform(img) {
    img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
  }

  function openImageViewer(src, alt) {
    let overlay = document.querySelector('.image-viewer-overlay');
    
    // 打开新图时，重置所有变换参数
    scale = 1.0;
    offsetX = 0;
    offsetY = 0;
    rotation = 0;
    isDragging = false;

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'image-viewer-overlay';
      overlay.innerHTML = `
        <div class="image-viewer-close" aria-label="Close">
          <span class="close-line close-line-1"></span>
          <span class="close-line close-line-2"></span>
        </div>
        <img class="image-viewer-img" src="" alt="" />
        <div class="image-viewer-toolbar">
          <button class="toolbar-btn btn-zoom-in" title="放大">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button class="toolbar-btn btn-zoom-out" title="缩小">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button class="toolbar-btn btn-reset" title="重置">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          <button class="toolbar-btn btn-rotate" title="旋转">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l3.67-3.67"></path>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(overlay);

      // 初始化交互事件
      initMouseInteractions(overlay);
      initTouchGestures(overlay);
      initToolbarActions(overlay);
    }

    const img = overlay.querySelector('.image-viewer-img');
    img.src = src;
    img.alt = alt;
    img.style.transition = 'none'; // 先禁用过渡，以便初始无闪烁渲染
    img.style.cursor = 'zoom-out';

    // 锁定页面滚动
    document.body.style.overflow = 'hidden';

    // 重置 overlay 背景色
    overlay.style.background = '';

    // 激活查看器并恢复缓动
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      setTimeout(() => {
        img.style.transition = ''; // 激活后恢复优雅缓动
        updateImageTransform(img);
      }, 50);
    });
  }

  function closeImageViewer() {
    const overlay = document.querySelector('.image-viewer-overlay');
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';

      const img = overlay.querySelector('.image-viewer-img');
      img.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform = 'scale(0.95) translateY(10px) rotate(0deg)';
      
      setTimeout(() => {
        if (!overlay.classList.contains('active')) {
          img.src = '';
          scale = 1.0;
          offsetX = 0;
          offsetY = 0;
          rotation = 0;
        }
      }, 400);
    }
  }

  // 鼠标交互：双击放大/恢复，滚轮放大/缩小，按下拖拽移动
  function initMouseInteractions(overlay) {
    const img = overlay.querySelector('.image-viewer-img');

    // 1. 双击切换缩放（1x <-> 2x）
    img.addEventListener('dblclick', function (e) {
      e.stopPropagation();
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      if (scale > 1.05) {
        scale = 1.0;
        offsetX = 0;
        offsetY = 0;
      } else {
        scale = 2.0;
        // 双击位置作为缩放参考偏移
        const rect = img.getBoundingClientRect();
        const clickX = e.clientX - (rect.left + rect.width / 2);
        const clickY = e.clientY - (rect.top + rect.height / 2);
        offsetX = -clickX;
        offsetY = -clickY;
      }
      updateImageTransform(img);
      setTimeout(() => { img.style.transition = ''; }, 300);
    });

    // 2. 鼠标滚轮缩放
    overlay.addEventListener('wheel', function (e) {
      e.preventDefault();
      img.style.transition = 'none'; // 滚轮缩放时禁用 transition 保持即时响应

      const zoomFactor = 0.15;
      const direction = e.deltaY < 0 ? 1 : -1;

      scale = Math.min(5.0, Math.max(0.5, scale + direction * zoomFactor));

      // 缩放级别回到 1.0 附近时，自动吸附并重置平移
      if (Math.abs(scale - 1.0) < 0.08 && direction < 0) {
        scale = 1.0;
        offsetX = 0;
        offsetY = 0;
      }

      updateImageTransform(img);
    }, { passive: false });

    // 3. 鼠标按下拖拽移动
    img.addEventListener('mousedown', function (e) {
      e.preventDefault();
      if (e.button !== 0) return; // 仅限左键
      isDragging = true;
      dragStartX = e.clientX - offsetX;
      dragStartY = e.clientY - offsetY;
      img.style.transition = 'none';
      img.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      offsetX = e.clientX - dragStartX;
      offsetY = e.clientY - dragStartY;
      updateImageTransform(img);
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        img.style.cursor = 'zoom-out';
      }
    });

    // 点击背景或关闭按钮关闭查看器
    overlay.addEventListener('click', function (e) {
      // 点击背景、关闭容器、或关闭线段均触发关闭
      if (e.target === overlay || 
          e.target.classList.contains('image-viewer-close') || 
          e.target.classList.contains('close-line')) {
        closeImageViewer();
      }
    });
  }

  // 移动端手势交互：双指捏合缩放（Pinch to Zoom），单指在缩放状态下拖拽平移，非缩放状态下下滑返回（Swipe to Dismiss）
  function initTouchGestures(overlay) {
    const img = overlay.querySelector('.image-viewer-img');
    let startX = 0, startY = 0;
    let initialOffsetX = 0, initialOffsetY = 0;
    let touchStartDist = 0;
    let touchStartScale = 1.0;
    let isPinching = false;
    let isTouchDragging = false;

    overlay.addEventListener('touchstart', function (e) {
      img.style.transition = 'none'; // 拖拽时立刻禁用过渡，达到 100% 极速跟手

      if (e.touches.length === 2) {
        // 激活双指捏合缩放
        isPinching = true;
        isTouchDragging = false;
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartScale = scale;
      } else if (e.touches.length === 1) {
        // 单指滑动
        isTouchDragging = true;
        isPinching = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialOffsetX = offsetX;
        initialOffsetY = offsetY;
      }
    }, { passive: true });

    overlay.addEventListener('touchmove', function (e) {
      if (isPinching && e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDist > 0) {
          const factor = currentDist / touchStartDist;
          scale = Math.min(5.0, Math.max(0.5, touchStartScale * factor));
          updateImageTransform(img);
        }
      } else if (isTouchDragging && e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;

        if (scale > 1.05) {
          // 放大状态：拖拽在视口中平移查看图片局部细节
          offsetX = initialOffsetX + diffX;
          offsetY = initialOffsetY + diffY;
          updateImageTransform(img);
        } else {
          // 1:1 状态下：纵向划动触发下滑关闭手势（WeChat 交互）
          const scaleDamp = Math.max(0.8, 1 - Math.abs(diffY) / 1000);
          img.style.transform = `translate(${initialOffsetX + diffX * 0.3}px, ${initialOffsetY + diffY * 0.85}px) scale(${scaleDamp}) rotate(${rotation}deg)`;
          
          // 遮罩层不透明度衰减，极其精致
          const opacity = Math.max(0.4, 0.95 - Math.abs(diffY) / 600);
          overlay.style.background = `rgba(9, 9, 11, ${opacity})`;
        }
      }
    }, { passive: true });

    overlay.addEventListener('touchend', function (e) {
      img.style.transition = ''; // 触摸离开，恢复平滑缓动
      overlay.style.background = '';

      if (isPinching) {
        isPinching = false;
        touchStartDist = 0;
        
        // 捏合如果过小，回弹复原
        if (scale < 0.92) {
          scale = 1.0;
          offsetX = 0;
          offsetY = 0;
          updateImageTransform(img);
        }
      } else if (isTouchDragging) {
        isTouchDragging = false;
        const currentY = e.changedTouches[0].clientY;
        const diffY = currentY - startY;

        if (scale > 1.05) {
          // 边界回弹或惯性移动可在后续扩充，这里保持图片留在当前平移位置
        } else {
          // 1:1 状态下的纵向手势释放判定
          if (Math.abs(diffY) > 80) {
            closeImageViewer();
          } else {
            // 滑动过小，原路归位弹回
            scale = 1.0;
            offsetX = 0;
            offsetY = 0;
            updateImageTransform(img);
          }
        }
      }
    });
  }

  // 工具栏交互：放大、缩小、重置、旋转
  function initToolbarActions(overlay) {
    const img = overlay.querySelector('.image-viewer-img');

    // 阻止工具栏点击事件冒泡到遮罩层导致关闭
    const toolbar = overlay.querySelector('.image-viewer-toolbar');
    toolbar.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    overlay.querySelector('.btn-zoom-in').addEventListener('click', function () {
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      scale = Math.min(5.0, scale + 0.35);
      updateImageTransform(img);
      setTimeout(() => { img.style.transition = ''; }, 300);
    });

    overlay.querySelector('.btn-zoom-out').addEventListener('click', function () {
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      scale = Math.max(0.4, scale - 0.35);
      updateImageTransform(img);
      setTimeout(() => { img.style.transition = ''; }, 300);
    });

    overlay.querySelector('.btn-reset').addEventListener('click', function () {
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      scale = 1.0;
      offsetX = 0;
      offsetY = 0;
      rotation = 0;
      updateImageTransform(img);
      setTimeout(() => { img.style.transition = ''; }, 300);
    });

    overlay.querySelector('.btn-rotate').addEventListener('click', function () {
      img.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      rotation = (rotation + 90) % 360;
      updateImageTransform(img);
      setTimeout(() => { img.style.transition = ''; }, 300);
    });
  }

  // 监听 ESC 键关闭大图
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeImageViewer();
    }
  });
});
