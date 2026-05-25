// tag-sankey.js - D3.js Sankey Diagram & Taxonomy Redirects
document.addEventListener('DOMContentLoaded', function () {
  const i18n = window.sankeyI18n || {
    all: "全部",
    yearCategory: "年份 ➔ 分类",
    categoryTag: "分类 ➔ 标签",
    tip: "提示：点击年份、分类或标签可跳转查看对应归档页面",
    loading: "图表加载中...",
    articlesList: "文章列表",
    articlesCount: "%s 篇",
    noArticles: "无文章数据",
    noChartData: "无关联图表数据",
    layoutError: "图表布局计算出错",
    flowPath: "关联流向路径",
    relatedArticles: "篇关联文章",
    archiveYear: "归档年份",
    articleCategory: "文章分类",
    tagCategory: "标签类别",
    containsArticles: "包含文章：",
    clickHint: "点击可跳转查看对应归档"
  };

  function formatArticlesCount(count) {
    return i18n.articlesCount.replace('%s', count);
  }

  // ==========================================
  // 1. 初始化数据与页面元素
  // ==========================================
  const postsEl = document.getElementById('posts-data');
  const taxEl = document.getElementById('taxonomies-data');
  if (!postsEl || !taxEl) return;

  let posts = [];
  let taxData = { categories: {}, tags: {}, yearBase: '/archives/' };
  try {
    posts = JSON.parse(postsEl.textContent);
    taxData = JSON.parse(taxEl.textContent);
  } catch (e) {
    console.error('Failed to parse serialization data:', e);
    return;
  }

  const chartContainer = document.getElementById('sankey-chart');
  const articlesListEl = document.getElementById('sankey-articles-list');
  const articlesCountEl = document.getElementById('sankey-articles-count');
  const tabs = document.querySelectorAll('.sankey-tab');

  // 当前激活视图: 'all' | 'year-category' | 'category-tag'
  let currentView = 'all';

  // ==========================================
  // 2. 视图显隐控制与文章列表渲染 (仅在 'all' 视图下显示列表)
  // ==========================================
  function updateViewVisibility() {
    const chartCard = document.getElementById('sankey-chart-card');
    const articlesSection = document.getElementById('sankey-articles-section');

    if (currentView === 'all') {
      if (chartCard) chartCard.style.display = 'none';
      if (articlesSection) articlesSection.style.display = 'block';
    } else {
      if (chartCard) chartCard.style.display = 'block';
      if (articlesSection) articlesSection.style.display = 'none';
    }
  }

  function renderArticlesList() {
    if (!articlesListEl) return;

    // "全部" 视图下，显示全量文章
    if (articlesCountEl) {
      articlesCountEl.textContent = formatArticlesCount(posts.length);
    }

    articlesListEl.innerHTML = '';

    if (posts.length === 0) {
      articlesListEl.innerHTML = `<div class="sankey-loader">${i18n.noArticles}</div>`;
      return;
    }

    posts.forEach(post => {
      const card = document.createElement('a');
      card.href = post.path;
      card.className = 'sankey-article-card';

      // 渲染分类与标签徽章
      let taxHtml = '';
      if (post.categories && post.categories.length > 0) {
        post.categories.forEach(cat => {
          taxHtml += `<span class="article-badge category-badge">${cat}</span>`;
        });
      }
      if (post.tags && post.tags.length > 0) {
        post.tags.slice(0, 3).forEach(tag => {
          taxHtml += `<span class="article-badge tag-badge">#${tag}</span>`;
        });
      }

      card.innerHTML = `
        <div class="article-card-header">
          <h4 class="article-card-title">${post.title}</h4>
        </div>
        <div class="article-card-footer">
          <span class="article-date">
            <i class="far fa-calendar-alt"></i> ${post.date}
          </span>
          <div class="article-taxonomies">${taxHtml}</div>
        </div>
      `;
      articlesListEl.appendChild(card);
    });

    // 运行 GSAP 动画
    if (typeof gsap !== 'undefined') {
      const animItems = articlesListEl.querySelectorAll('.sankey-article-card');
      gsap.fromTo(animItems,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.45, 
          stagger: 0.04, 
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
      
      animItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            y: -4,
            scale: 1.015,
            borderColor: 'var(--secondary-text-color)',
            boxShadow: '0 8px 20px var(--shadow-color1)',
            duration: 0.25,
            ease: 'power2.out'
          });
        });
        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            y: 0,
            scale: 1,
            borderColor: 'var(--shadow-color1)',
            boxShadow: '0 2px 8px var(--shadow-color2)',
            duration: 0.25,
            ease: 'power2.out'
          });
        });
      });
    }
  }

  // ==========================================
  // 3. D3.js 桑基图色彩生成
  // ==========================================
  const colorCache = {};
  function getNodeColor(name, type) {
    const key = `${type}-${name}`;
    if (colorCache[key]) return colorCache[key];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches &&
       document.documentElement.getAttribute('data-theme') !== 'light');

    if (type === 'year') {
      colorCache[key] = isDark ? '#3b82f6' : '#60a5fa'; // 优雅蓝色系
      return colorCache[key];
    } else if (type === 'category') {
      colorCache[key] = isDark ? '#10b981' : '#34d399'; // 柔和绿色系
      return colorCache[key];
    }

    // 标签使用 HSL 生成唯一颜色
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const s = isDark ? 65 : 70;
    const l = isDark ? 50 : 60;
    
    colorCache[key] = `hsl(${hue}, ${s}%, ${l}%)`;
    return colorCache[key];
  }

  // ==========================================
  // 4. D3.js 桑基图渲染与重定向逻辑
  // ==========================================
  function renderSankey() {
    if (currentView === 'all' || !chartContainer) return;
    chartContainer.innerHTML = '';

    const width = chartContainer.clientWidth;

    let rawLinks = [];

    posts.forEach(post => {
      const year = post.year;
      const categories = post.categories && post.categories.length > 0 ? post.categories : ['未分类'];
      const tags = post.tags && post.tags.length > 0 ? post.tags : ['无标签'];

      if (currentView === 'year-category') {
        // 年份 -> 分类
        categories.forEach(cat => {
          rawLinks.push({
            sourceId: `year-${year}`,
            sourceName: year,
            sourceType: 'year',
            targetId: `cat-${cat}`,
            targetName: cat,
            targetType: 'category',
            val: 1 / categories.length
          });
        });
      } else if (currentView === 'category-tag') {
        // 分类 -> 标签
        categories.forEach(cat => {
          tags.forEach(tag => {
            rawLinks.push({
              sourceId: `cat-${cat}`,
              sourceName: cat,
              sourceType: 'category',
              targetId: `tag-${tag}`,
              targetName: tag,
              targetType: 'tag',
              val: 1 / (categories.length * tags.length)
            });
          });
        });
      }
    });

    // 聚合连线数据
    const linkMap = {};
    rawLinks.forEach(l => {
      const key = `${l.sourceId}->${l.targetId}`;
      if (linkMap[key]) {
        linkMap[key].value += l.val;
      } else {
        linkMap[key] = {
          source: l.sourceId,
          target: l.targetId,
          sourceName: l.sourceName,
          sourceType: l.sourceType,
          targetName: l.targetName,
          targetType: l.targetType,
          value: l.val
        };
      }
    });
    const links = Object.values(linkMap);

    // 收集节点
    const nodeMap = {};
    links.forEach(l => {
      if (!nodeMap[l.source]) {
        nodeMap[l.source] = { id: l.source, name: l.sourceName, type: l.sourceType };
      }
      if (!nodeMap[l.target]) {
        nodeMap[l.target] = { id: l.target, name: l.targetName, type: l.targetType };
      }
    });
    const nodes = Object.values(nodeMap);

    // 计算各列节点数以动态调整高度，确保每个节点都有足够的垂直插值空间（至少28px），防止颜色块扩增后发生重叠遮挡
    const leftCount = nodes.filter(n => n.type === (currentView === 'year-category' ? 'year' : 'category')).length;
    const rightCount = nodes.filter(n => n.type === (currentView === 'year-category' ? 'category' : 'tag')).length;
    const maxColumnNodes = Math.max(leftCount, rightCount);
    const height = Math.max(450, maxColumnNodes * 28 + 30);

    function getPostCategories(post) {
      return post.categories && post.categories.length > 0 ? post.categories : ['未分类'];
    }
    function getPostTags(post) {
      return post.tags && post.tags.length > 0 ? post.tags : ['无标签'];
    }

    // 计算节点的真实文章数
    nodes.forEach(n => {
      if (n.type === 'year') {
        n.postCount = posts.filter(p => p.year === n.name).length;
      } else if (n.type === 'category') {
        n.postCount = posts.filter(p => getPostCategories(p).includes(n.name)).length;
      } else if (n.type === 'tag') {
        n.postCount = posts.filter(p => getPostTags(p).includes(n.name)).length;
      }
    });

    // 计算连线的真实关联文章数
    links.forEach(l => {
      let count = 0;
      posts.forEach(p => {
        let matchSource = false;
        let matchTarget = false;

        // 匹配源节点
        if (l.sourceType === 'year') {
          matchSource = p.year === l.sourceName;
        } else if (l.sourceType === 'category') {
          matchSource = getPostCategories(p).includes(l.sourceName);
        }

        // 匹配目标节点
        if (l.targetType === 'category') {
          matchTarget = getPostCategories(p).includes(l.targetName);
        } else if (l.targetType === 'tag') {
          matchTarget = getPostTags(p).includes(l.targetName);
        }

        if (matchSource && matchTarget) {
          count++;
        }
      });
      l.postCount = count;
    });

    const nodeIndex = {};
    nodes.forEach((n, idx) => {
      nodeIndex[n.id] = idx;
    });

    const d3Links = links.map(l => ({
      source: nodeIndex[l.source],
      target: nodeIndex[l.target],
      value: l.value,
      postCount: l.postCount
    }));

    if (nodes.length === 0 || d3Links.length === 0) {
      chartContainer.innerHTML = `<div class="sankey-loader">${i18n.noChartData}</div>`;
      return;
    }

    // 渲染 SVG Canvas
    const svg = d3.select('#sankey-chart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    const defs = svg.append('defs');

    const sankey = d3.sankey()
      .nodeWidth(18)
      .nodePadding(16)
      .extent([[2, 10], [width - 2, height - 10]]);

    let graph;
    try {
      graph = sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: d3Links.map(d => Object.assign({}, d))
      });
    } catch (err) {
      console.error('D3 Sankey layout error:', err);
      chartContainer.innerHTML = `<div class="sankey-loader">${i18n.layoutError}</div>`;
      return;
    }

    // 创建连线渐变
    graph.links.forEach((l, idx) => {
      const gradId = `link-grad-${idx}`;
      const grad = defs.append('linearGradient')
        .attr('id', gradId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', l.source.x1)
        .attr('y1', l.y0)
        .attr('x2', l.target.x0)
        .attr('y2', l.y1);

      grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', getNodeColor(l.source.name, l.source.type));

      grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', getNodeColor(l.target.name, l.target.type));
    });

    // 创建 Tooltip 浮动框
    let tooltip = d3.select('#sankey-chart .sankey-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('#sankey-chart')
        .append('div')
        .attr('class', 'sankey-tooltip');
    }

    function positionTooltip(event) {
      const containerRect = chartContainer.getBoundingClientRect();
      const tooltipNode = tooltip.node();
      const tooltipWidth = tooltipNode ? tooltipNode.offsetWidth : 200;
      const tooltipHeight = tooltipNode ? tooltipNode.offsetHeight : 80;

      let tooltipX = event.clientX - containerRect.left + 15;
      let tooltipY = event.clientY - containerRect.top + 15;

      // Prevent right overflow
      if (tooltipX + tooltipWidth > containerRect.width) {
        tooltipX = event.clientX - containerRect.left - tooltipWidth - 15;
      }
      if (tooltipX < 0) {
        tooltipX = 10;
      }

      // Prevent bottom overflow
      if (tooltipY + tooltipHeight > containerRect.height) {
        tooltipY = event.clientY - containerRect.top - tooltipHeight - 15;
      }
      if (tooltipY < 0) {
        tooltipY = 10;
      }

      tooltip.style('left', `${tooltipX}px`).style('top', `${tooltipY}px`);
    }

    // 绘制连线
    const link = svg.append('g')
      .attr('class', 'sankey-links')
      .selectAll('path')
      .data(graph.links)
      .enter()
      .append('path')
      .attr('class', 'sankey-link')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', (d, i) => `url(#link-grad-${i})`)
      .attr('stroke-width', d => Math.max(1.5, d.width))
      .attr('stroke-opacity', 0.25)
      .on('mouseover', function (event, d) {
        d3.select(this).style('stroke-opacity', 0.7);
        tooltip
          .style('opacity', 1)
          .html(`
            <div class="tooltip-header" style="margin-bottom: 0.4rem; border-bottom: 1px solid var(--shadow-color1); padding-bottom: 0.3rem;">
              <span style="display: flex; align-items: center; gap: 0.4rem; color: var(--secondary-text-color); font-weight: normal; font-size: 0.8rem;">
                <i class="fas fa-random"></i> ${i18n.flowPath}
              </span>
              <strong style="color: var(--text-color); font-size: 0.85rem;">
                <span style="color: ${getNodeColor(d.source.name, d.source.type)};">${d.postCount}</span> ${i18n.relatedArticles}
              </strong>
            </div>
            <div class="tooltip-body" style="font-weight: 500; font-size: 0.8rem;">
              <span style="color: ${getNodeColor(d.source.name, d.source.type)}; font-weight: 600;">${d.source.name}</span>
              <i class="fas fa-long-arrow-alt-right" style="color: var(--secondary-text-color); margin: 0 0.5rem; font-size: 0.8rem;"></i>
              <span style="color: ${getNodeColor(d.target.name, d.target.type)}; font-weight: 600;">${d.target.name}</span>
            </div>
          `);
      })
      .on('mousemove', function (event) {
        positionTooltip(event);
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke-opacity', 0.25);
        tooltip.style('opacity', 0);
      });

    // 绘制节点
    const node = svg.append('g')
      .attr('class', 'sankey-nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'sankey-node')
      .on('click', function (event, d) {
        event.stopPropagation();
        const { type, name } = d;
        let targetUrl = '';
        
        if (type === 'year') {
          let yearBase = taxData.yearBase || '/archives/';
          if (!yearBase.endsWith('/')) yearBase += '/';
          targetUrl = yearBase + name + '/';
        } else if (type === 'category') {
          targetUrl = taxData.categories[name];
        } else if (type === 'tag') {
          targetUrl = taxData.tags[name];
        }

        if (targetUrl) {
          // 跳转至分类查询页面
          window.location.href = targetUrl;
        } else {
          console.warn(`No mapping URL found for: ${type} - ${name}`);
        }
      });

    // 绘制节点矩形
    node.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => {
        const minHeight = 12;
        const actualHeight = d.y1 - d.y0;
        return actualHeight < minHeight ? d.y0 - (minHeight - actualHeight) / 2 : d.y0;
      })
      .attr('height', d => Math.max(12, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => getNodeColor(d.name, d.type))
      .attr('fill-opacity', 0.8)
      .on('mouseover', function (event, d) {
        const typeLabel = d.type === 'year' ? i18n.archiveYear : d.type === 'category' ? i18n.articleCategory : i18n.tagCategory;
        const typeIcon = d.type === 'year' ? 'far fa-calendar-alt' : d.type === 'category' ? 'far fa-folder-open' : 'fas fa-tag';
        const accentColor = getNodeColor(d.name, d.type);

        tooltip
          .style('opacity', 1)
          .html(`
            <div class="tooltip-header" style="margin-bottom: 0.4rem; border-bottom: 1px solid var(--shadow-color1); padding-bottom: 0.3rem;">
              <span style="display: flex; align-items: center; gap: 0.4rem; color: var(--secondary-text-color); font-weight: normal; font-size: 0.8rem;">
                <i class="${typeIcon}" style="color: ${accentColor}; font-size: 0.85rem;"></i> ${typeLabel}
              </span>
              <strong style="color: var(--text-color); font-size: 0.85rem; border-left: 2px solid ${accentColor}; padding-left: 0.4rem; margin-left: 0.4rem;">
                ${d.name}
              </strong>
            </div>
            <div class="tooltip-body" style="font-size: 0.8rem; line-height: 1.6;">
              <div style="margin-bottom: 0.2rem; color: var(--text-color);">
                ${i18n.containsArticles}<strong style="font-size: 0.9rem; color: ${accentColor}; font-weight: bold;">${formatArticlesCount(d.postCount)}</strong>
              </div>
              <div style="display: flex; align-items: center; gap: 0.3rem; color: var(--secondary-text-color); font-size: 0.75rem; border-top: 1px dashed var(--shadow-color1); padding-top: 0.3rem; margin-top: 0.3rem;">
                <i class="fas fa-mouse-pointer" style="font-size: 0.7rem;"></i>
                <span>${i18n.clickHint}</span>
              </div>
            </div>
          `);

        const connected = new Set();
        d.sourceLinks.forEach(l => connected.add(l));
        d.targetLinks.forEach(l => connected.add(l));
        link.style('stroke-opacity', l => connected.has(l) ? 0.7 : 0.05);
      })
      .on('mousemove', function (event) {
        positionTooltip(event);
      })
      .on('mouseout', function () {
        link.style('stroke-opacity', 0.25);
        tooltip.style('opacity', 0);
      });

    // 绘制节点文字
    node.append('text')
      .attr('x', d => {
        if (d.x0 < width / 2) return d.x1 + 8; // 左列靠右排布
        return d.x0 - 8; // 右列靠左排布
      })
      .attr('y', d => {
        const minHeight = 12;
        const actualHeight = d.y1 - d.y0;
        if (actualHeight < minHeight) {
          const drawY0 = d.y0 - (minHeight - actualHeight) / 2;
          return drawY0 + minHeight / 2;
        }
        return (d.y0 + d.y1) / 2;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', d => {
        if (d.x0 < width / 2) return 'start';
        return 'end';
      })
      .text(d => d.name);
  }

  // ==========================================
  // 5. 视图切换逻辑
  // ==========================================
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const view = this.getAttribute('data-view');
      if (view !== currentView) {
        currentView = view;
        updateViewVisibility();
        if (currentView === 'all') {
          renderArticlesList();
        } else {
          renderSankey();
        }
      }
    });
  });

  // ==========================================
  // 6. 响应式与初始启动
  // ==========================================
  let resizeTimeout;
  window.addEventListener('resize', function () {
    if (currentView === 'all') return;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderSankey();
    }, 200);
  });

  // 初次加载启动
  updateViewVisibility();
  renderArticlesList();
});
