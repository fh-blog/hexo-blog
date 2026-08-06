hexo.extend.injector.register('head_end', `
<style>
  /* 隐藏搜索图标 */
  .nav-search-btn { display: none !important; }
  /* 隐藏搜索框 */
  #search-form-wrap { display: none !important; }
  /* 隐藏RSS订阅图标 */
  a.nav-icon[title="RSS 订阅"] { display: none !important; }
</style>
`, 'default');
