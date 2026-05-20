// 代码块工具栏与复制功能
document.addEventListener('DOMContentLoaded', function () {
  const highlightBlocks = document.querySelectorAll('figure.highlight');

  highlightBlocks.forEach(function (block) {
    // 1. 获取代码语言
    let lang = 'code';
    block.classList.forEach(function (className) {
      if (className !== 'highlight' && className !== 'no-gsap') {
        lang = className;
      }
    });

    // 2. 创建工具栏
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    // 创建 macOS 风格的三个控制小圆点
    const dots = document.createElement('div');
    dots.className = 'code-dots';
    dots.innerHTML = '<span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span>';
    toolbar.appendChild(dots);

    // 创建元数据区（语言 + 复制按钮）
    const meta = document.createElement('div');
    meta.className = 'code-meta';

    const langLabel = document.createElement('span');
    langLabel.className = 'code-lang';
    langLabel.textContent = lang;
    meta.appendChild(langLabel);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.textContent = '复制';
    meta.appendChild(copyBtn);

    toolbar.appendChild(meta);

    // 3. 将工具栏插入代码块顶部
    block.insertBefore(toolbar, block.firstChild);

    // 4. 绑定复制点击事件
    copyBtn.addEventListener('click', function () {
      // 提取纯代码文本 (只读取代码区文字，排除了行号区)
      const codeElement = block.querySelector('td.code pre');
      if (!codeElement) return;

      const codeText = codeElement.innerText || codeElement.textContent;

      navigator.clipboard.writeText(codeText).then(
        function () {
          copyBtn.textContent = '已复制!';
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.textContent = '复制';
            copyBtn.classList.remove('copied');
          }, 2000);
        },
        function (err) {
          console.error('Copy failed: ', err);
          copyBtn.textContent = '复制失败';
          setTimeout(function () {
            copyBtn.textContent = '复制';
          }, 2000);
        }
      );
    });
  });
});
