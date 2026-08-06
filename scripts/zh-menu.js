hexo.on('generateBefore', function() {
  // Override theme menu to Chinese
  if (hexo.theme.config) {
    hexo.theme.config.menu = {
      '首页': '/',
      '归档': '/archives',
      '搜索': '/search',
    };
    hexo.theme.config.excerpt_link = '阅读更多';
  }
});
