hexo.extend.injector.register('body_end', function() {
  return `
<style>
.article-share-wechat,.article-share-qq,.article-share-dingtalk,.article-share-copy{width:50px;height:36px;display:block;float:left;position:relative;color:#999;text-shadow:0 1px #fff;text-decoration:none;text-align:center;line-height:36px;font-weight:bold}
.article-share-wechat:hover{color:#fff;background:#07c160}
.article-share-qq:hover{color:#fff;background:#12b7f5}
.article-share-dingtalk:hover{color:#fff;background:#0089ff}
.article-share-copy:hover{color:#fff;background:#555}
.article-share-copy .fa{font-size:20px}
</style>
<script>
$('body').off('click','.article-share-link').off('click','.article-share-box-link').on('click','.article-share-link',function(e){
  e.stopPropagation();
  var t=$(this), url=t.attr('data-url'), id='article-share-box-'+t.attr('data-id'),
      title=t.attr('data-title'), offset=t.offset(), eu=encodeURIComponent(url);
  if($('#'+id).length){var box=$('#'+id);if(box.hasClass('on')){box.removeClass('on');return}}
  else{
    var html=[
      '<div id="'+id+'" class="article-share-box">',
        '<input class="article-share-input" value="'+url+'">',
        '<div class="article-share-links">',
          '<a href="javascript:;" class="article-share-wechat" title="微信" data-url="'+url+'" data-p="微信">微</a>',
          '<a href="https://connect.qq.com/widget/shareqq/index.html?url='+eu+'&title='+encodeURIComponent(title)+'" class="article-share-qq" target="_blank" title="QQ">Q</a>',
          '<a href="javascript:;" class="article-share-dingtalk" title="钉钉" data-url="'+url+'" data-p="钉钉">钉</a>',
          '<a href="javascript:;" class="article-share-copy" title="复制链接" data-url="'+url+'"><span class="fa fa-link"></span></a>',
        '</div>',
      '</div>'
    ].join('');
    var box=$(html);$('body').append(box);
  }
  $('.article-share-box.on').hide();
  box.css({top:offset.top+25,left:offset.left}).addClass('on');
}).on('click','.article-share-box',function(e){e.stopPropagation()})
  .on('click','.article-share-box-input',function(){$(this).select()})
  .on('click','.article-share-qq',function(e){e.preventDefault();window.open(this.href,'qq','width=500,height=450')})
  .on('click','.article-share-dingtalk',function(e){
    e.preventDefault();e.stopPropagation();
    var $t=$(this), url=$t.attr('data-url');
    window.open('dingtalk://dingtalkclient/page/link?url='+encodeURIComponent(url)+'&pc_slide=true','_self');
    copyLink(url,'钉钉');
  })
  .on('click','.article-share-wechat',function(e){
    e.preventDefault();e.stopPropagation();
    var $t=$(this), url=$t.attr('data-url');
    window.open('https://cli.im/api/qrcode/code?text='+encodeURIComponent(url)+'&mhid=topQRcode','wechat-qr','width=430,height=430');
    copyLink(url,'微信');
  })
  .on('click','.article-share-copy',function(e){
    e.preventDefault();e.stopPropagation();
    copyLink($(this).attr('data-url'),'');
  });
function copyLink(url,platform){
  var msg=platform?'已复制，请打开'+platform+'粘贴':'已复制';
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){alert(msg)}).catch(function(){prompt(msg+':',url)});
  }else{
    var ta=document.createElement('textarea');ta.value=url;ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');alert(msg)}catch(e){prompt(msg+':',url)}
    document.body.removeChild(ta);
  }
}
</script>`;
});
