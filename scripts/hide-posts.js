var hiddenPosts = [];

hexo.on('generateBefore', function () {
  hiddenPosts = [];

  var posts = hexo.locals.get('posts');
  if (!posts || !posts.length) return;

  // 从 locals 的 posts Query 过滤，避免 Post.toArray() 拿到旧快照
  hiddenPosts = posts.filter(function (p) {
    return p.hidden;
  }).toArray();

  var visible = posts.filter(function (p) {
    return !p.hidden;
  });

  hexo.log.info('[hide-posts] 隐藏 %d 篇，可见 %d 篇', hiddenPosts.length, visible.length);

  // 替换全局 posts，只含可见文章（visible 已是 Query，无需包装）
  hexo.locals.set('posts', visible);

  // 过滤标签和分类：只保留至少有一篇可见文章的
  ['tags', 'categories'].forEach(function (key) {
    var items = hexo.locals.get(key);
    if (!items || !items.length) return;

    var Model = hexo.model(key === 'tags' ? 'Tag' : 'Category');
    var visibleIds = [];
    items.forEach(function (item) {
      var hasVisible = item.posts.toArray().some(function (p) {
        return !p.hidden;
      });
      if (hasVisible) visibleIds.push(item._id);
    });

    hexo.locals.set(key, Model.find({ _id: { $in: visibleIds } }));
  });
});

// 为隐藏文章生成详情页（直接 URL 可访问）
hexo.extend.generator.register('hidden-post-page', function () {
  return hiddenPosts.map(function (post) {
    return {
      path: post.path,
      data: post,
      layout: 'post'
    };
  });
});

// 生成 /hidden 隐藏文章列表
hexo.extend.generator.register('hidden-list-page', function () {
  if (hiddenPosts.length === 0) return [];

  var root = hexo.config.root;
  var sorted = hiddenPosts.slice().sort(function (a, b) { return b.date - a.date; });

  var listItems = sorted.map(function (p) {
    return '<li><a href="' + root + p.path + '">' + p.title + '</a> — ' + p.date.format('YYYY-MM-DD') + '</li>';
  }).join('\n');

  return [{
    path: 'hidden/index.html',
    data: {
      title: '隐藏文章',
      date: new Date(),
      content: '<h2>隐藏文章</h2><p>共 ' + sorted.length + ' 篇</p><ul>' + listItems + '</ul>'
    },
    layout: 'page'
  }];
});

// 从搜索数据中移除隐藏文章
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (data.path !== 'search/index.html' || hiddenPosts.length === 0) return str;

  hiddenPosts.forEach(function (post) {
    var escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('\\{[^}]*"title":"' + escapedTitle + '"[^}]*\\},?', 'g');
    str = str.replace(regex, '');
  });

  return str;
});
