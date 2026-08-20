// ============================================================
// 公共脚本 · 杨晟琦文明公理系统
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ----- 1. 侧边栏当前页高亮（精确匹配 + 文件名结尾匹配）-----
    (function highlightCurrentPage() {
        var currentPath = window.location.pathname;
        var currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

        // 如果是目录访问（末尾有 /），默认首页
        if (currentFile === '' || currentPath.endsWith('/')) {
            currentFile = 'index.html';
        }

        // 解码当前文件名（处理中文 URL 编码）
        var currentFileDecoded = currentFile;
        try {
            currentFileDecoded = decodeURIComponent(currentFile);
        } catch (e) {}

        var allLinks = document.querySelectorAll('.sidebar nav a');
        var matched = false;

        allLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href) return;

            // 去掉锚点，移除 ./ 前缀
            var hrefFile = href.split('#')[0];
            var hrefClean = hrefFile.replace(/^\.\//, '');
            try {
                hrefClean = decodeURIComponent(hrefClean);
            } catch (e) {}

            // 多种匹配方式
            var isMatch = false;

            // 1. 精确匹配
            if (hrefClean === currentFileDecoded) {
                isMatch = true;
            }
            // 2. hrefClean 以当前文件名结尾（支持子目录）
            else if (hrefClean.endsWith('/' + currentFileDecoded)) {
                isMatch = true;
            }
            // 3. 当前文件名以 hrefClean 结尾
            else if (currentFileDecoded.endsWith('/' + hrefClean)) {
                isMatch = true;
            }
            // 4. 文件名完全匹配（忽略路径前缀）
            else {
                var hrefBase = hrefClean.substring(hrefClean.lastIndexOf('/') + 1);
                var currentBase = currentFileDecoded.substring(currentFileDecoded.lastIndexOf('/') + 1);
                if (hrefBase === currentBase && hrefBase !== '') {
                    isMatch = true;
                }
            }

            if (isMatch) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                matched = true;
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

        // 兜底：如果没有精确匹配，尝试宽松匹配（文件名包含关系）
        if (!matched) {
            allLinks.forEach(function(link) {
                var href = link.getAttribute('href');
                if (!href) return;
                var hrefFile = href.split('#')[0].replace(/^\.\//, '');
                try {
                    hrefFile = decodeURIComponent(hrefFile);
                } catch (e) {}
                var hrefBase = hrefFile.substring(hrefFile.lastIndexOf('/') + 1);
                var currentBase = currentFileDecoded.substring(currentFileDecoded.lastIndexOf('/') + 1);
                if (hrefBase !== '' && currentBase !== '' &&
                    (hrefBase.indexOf(currentBase) !== -1 || currentBase.indexOf(hrefBase) !== -1)) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    })();

    // ----- 2. 复制功能（保持不变）-----
    window.copyBib = function(boxId) {
        var box = document.getElementById(boxId);
        if (!box) return;
        var contentEl = box.querySelector('.bib-content');
        if (!contentEl) return;
        var text = contentEl.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopied(box);
            }).catch(function() {
                fallbackCopy(text, box);
            });
        } else {
            fallbackCopy(text, box);
        }
    };

    function fallbackCopy(text, box) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopied(box);
        } catch (e) {
            alert('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }

    function showCopied(box) {
        var btn = box.querySelector('.copy-btn');
        if (!btn) return;
        var original = btn.textContent;
        btn.textContent = '✅ 已复制';
        btn.classList.add('copied');
        setTimeout(function() {
            btn.textContent = original;
            btn.classList.remove('copied');
        }, 2000);
    }

});

// ----- 3. 返回顶部按钮（保持不变）-----
(function backToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '⬆';
    btn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(btn);

    var timer = null;
    window.addEventListener('scroll', function() {
        if (timer) return;
        timer = setTimeout(function() {
            timer = null;
            if (window.scrollY > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, 80);
    }, { passive: true });

    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();