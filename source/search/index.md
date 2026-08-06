---
title: 站内搜索
layout: page
---

<style>
#search-box { width: 100%; padding: 12px 16px; font-size: 16px; border: 2px solid #ddd; border-radius: 6px; outline: none; box-sizing: border-box; margin-bottom: 24px; }
#search-box:focus { border-color: #258fb8; }
.search-item { display: block; padding: 12px 0; border-bottom: 1px solid #eee; text-decoration: none; color: #333; }
.search-item strong { display: block; font-size: 16px; color: #258fb8; margin-bottom: 4px; }
.search-item em { display: block; font-size: 14px; color: #999; font-style: normal; }
.search-item:hover strong { text-decoration: underline; }
.search-empty { text-align: center; color: #999; padding: 40px 0; font-size: 15px; }
</style>

<input type="text" id="search-box" placeholder="输入关键词搜索..." autofocus>
<div id="search-results"></div>

<script>
(function(){
  var box = document.getElementById('search-box'),
      out = document.getElementById('search-results'),
      data = null, timer;

  fetch('/search.xml')
    .then(function(r) { return r.text(); })
    .then(function(t) { data = t; })
    .catch(function() { out.innerHTML = '<p class="search-empty">搜索数据加载失败</p>'; });

  function parse(xml) {
    var entries = [], m, re = /<entry>([\s\S]*?)<\/entry>/g;
    while ((m = re.exec(xml))) {
      var t = /<title>([\s\S]*?)<\/title>/i.exec(m[1]);
      var u = /<url>([^<]*)<\/url>/i.exec(m[1]);
      var c = /<content[^>]*>/i.exec(m[1]);
      if (t && u) {
        var body = '';
        if (c) {
          var start = c.index + c[0].length;
          var end = m[1].indexOf('</content>', start);
          if (end > start) {
            body = m[1].substring(start, end);
            body = body.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          }
        }
        entries.push({ title: t[1].trim(), url: u[1].trim(), content: body });
      }
    }
    return entries;
  }

  box.addEventListener('input', function() {
    clearTimeout(timer);
    var kw = this.value.trim();
    if (!kw) { out.innerHTML = ''; return; }
    if (!data) { out.innerHTML = '<p class="search-empty">加载中...</p>'; return; }
    timer = setTimeout(function() {
      var entries = parse(data), results = [];
      kw = kw.toLowerCase();
      for (var i = 0; i < entries.length && results.length < 10; i++) {
        var e = entries[i];
        if (e.title.toLowerCase().indexOf(kw) >= 0 || e.content.toLowerCase().indexOf(kw) >= 0)
          results.push(e);
      }
      if (!results.length) { out.innerHTML = '<p class="search-empty">没有找到结果</p>'; return; }
      var html = '';
      for (var j = 0; j < results.length; j++) {
        var r = results[j], ex = r.content.substring(0, 120);
        html += '<a class="search-item" href="' + r.url + '"><strong>' + r.title + '</strong><em>' + ex + '</em></a>';
      }
      out.innerHTML = html;
    }, 200);
  });
})();
</script>
