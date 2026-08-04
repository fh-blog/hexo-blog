hexo.on('generateBefore', function() {
  // Override theme menu to Chinese
  if (hexo.theme.config) {
    hexo.theme.config.menu = {
      '首页': '/',
      '归档': '/archives'
    };
    hexo.theme.config.excerpt_link = '阅读更多';
  }
});
