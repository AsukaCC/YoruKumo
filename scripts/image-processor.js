/**
 * YoruKumo Theme Image Processor
 * Optimizes image rendering in Hexo posts:
 * - Wraps images in a premium lazy-loading skeleton component.
 * - Extracts dimensions to apply aspect-ratio styles preventing Content Layout Shift (CLS).
 * - Supports local image size auto-detection, URL-embedded size patterns, and custom markdown size suffixes.
 */

'use strict';

const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

/**
 * Parses an HTML attribute string into a key-value object
 */
function parseAttributes(attrStr) {
  const attrs = {};
  if (!attrStr) return attrs;
  
  // Captures attributeName="value" or attributeName='value' or attributeName=value
  const regex = /(\w+(?:-\w+)*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/gi;
  let match;
  while ((match = regex.exec(attrStr)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : match[4]);
    attrs[key] = val;
  }
  return attrs;
}

/**
 * Extracts width and height for a given image URL or file path
 */
function getImageDimensions(src, hexo) {
  // 1. Try to extract width and height from Picsum URLs (e.g., picsum.photos/800/450)
  const picsumMatch = src.match(/picsum\.photos\/(?:id\/\d+\/)?(\d+)\/(\d+)/);
  if (picsumMatch) {
    return { width: parseInt(picsumMatch[1], 10), height: parseInt(picsumMatch[2], 10) };
  }

  // 2. Try to parse query parameters (e.g. ?width=800&height=450 or ?w=800&h=450)
  const wMatch = src.match(/[\?&](w|width)=(\d+)/i);
  const hMatch = src.match(/[\?&](h|height)=(\d+)/i);
  if (wMatch && hMatch) {
    return { width: parseInt(wMatch[2], 10), height: parseInt(hMatch[2], 10) };
  }

  // 3. Try to parse standard dimension patterns in URL hash/query/suffix (e.g., image.png#800x450)
  const hashMatch = src.match(/[#\?=\s](\d+)x(\d+)/);
  if (hashMatch) {
    return { width: parseInt(hashMatch[1], 10), height: parseInt(hashMatch[2], 10) };
  }

  // 4. Try to resolve local images using image-size
  if (!src.includes('://') && !src.startsWith('//')) {
    try {
      const cleanPath = src.split('?')[0].split('#')[0];
      const localPath = path.join(hexo.source_dir, cleanPath);
      if (fs.existsSync(localPath)) {
        const dimensions = sizeOf(localPath);
        if (dimensions && dimensions.width && dimensions.height) {
          return { width: dimensions.width, height: dimensions.height };
        }
      }
    } catch (err) {
      hexo.log.warn('[ImageProcessor] Failed to get dimensions for local image: ' + src);
    }
  }

  return null;
}

// Register the Hexo filter for after_post_render
hexo.extend.filter.register('after_post_render', function(data) {
  if (!data || !data.content) return data;

  // Regular expression to match img tags
  // Group 1: attributes before src, Group 2: src URL, Group 3: attributes after src
  const imgRegex = /<img\s+([^>]*?)src="([^"]+?)"([^>]*?)>/gi;

  data.content = data.content.replace(imgRegex, (match, before, src, after) => {
    let cleanSrc = src;
    let customWidth = null;
    let customHeight = null;

    // Detect and extract custom markdown suffix dimension parameters (e.g. "=800x450" or "%20=800x450" at the end of the src)
    const suffixMatch = cleanSrc.match(/(?:%20|\s)?=(\d+)x(\d+)$/);
    if (suffixMatch) {
      customWidth = parseInt(suffixMatch[1], 10);
      customHeight = parseInt(suffixMatch[2], 10);
      cleanSrc = cleanSrc.substring(0, suffixMatch.index); // Strip out the dimensions parameter
    }

    // Combine other attributes and parse them
    const combinedAttrs = (before + ' ' + after).trim();
    const parsedAttrs = parseAttributes(combinedAttrs);

    // Extract attributes
    const alt = parsedAttrs.alt || '';
    const title = parsedAttrs.title || '';
    
    // Determine dimensions (Priority: inline HTML > Markdown suffix > Auto-detect)
    let width = parsedAttrs.width ? parseInt(parsedAttrs.width, 10) : customWidth;
    let height = parsedAttrs.height ? parseInt(parsedAttrs.height, 10) : customHeight;

    if (!width || !height) {
      const dims = getImageDimensions(cleanSrc, hexo);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }

    // Filter out specific attributes we're manually managing from the remaining attributes list
    let otherAttrsStr = '';
    for (const key in parsedAttrs) {
      if (!['src', 'alt', 'title', 'width', 'height', 'class', 'loading', 'onload', 'onerror'].includes(key)) {
        otherAttrsStr += ` ${key}="${parsedAttrs[key]}"`;
      }
    }

    // Preserve any existing class names (e.g. aligncenter, etc.)
    const extraClass = parsedAttrs.class ? ` ${parsedAttrs.class}` : '';

    // HTML Output Structure
    let styleAttr = '';
    let ratioAttr = '';
    
    if (width && height) {
      styleAttr = `style="aspect-ratio: ${width} / ${height}; --aspect-ratio: ${width / height};"`;
      ratioAttr = `width="${width}" height="${height}"`;
    }

    return `
<div class="lazy-image-container${extraClass}" ${styleAttr}>
  <img class="lazy-image" 
       src="${cleanSrc}" 
       alt="${alt}" 
       title="${title}" 
       loading="lazy" 
       ${ratioAttr}
       ${otherAttrsStr}
       onload="this.classList.add('loaded');" 
       onerror="this.parentElement.classList.add('error');">
  <div class="lazy-image-skeleton"></div>
</div>
`.trim();
  });

  return data;
});
