chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.task) {
      case 'copy':
        return copy(request, sender, sendResponse)
      default:
        break
    }
  }
);

const copy = (request, sender, sendResponse) => {
  const configWebsites = request.configure.websites
  const locationUrl = location.href
  let _url = ''
  let _contentSelector = ''
  let _titleSelector = ''
  let _filter = ''

  configWebsites.forEach(({ url, contentSelector, titleSelector, filter }) => {
    const reg = new RegExp(url)
    if (reg.test(locationUrl)) { // 如果匹配上
      _url = url
      _contentSelector = contentSelector
      _titleSelector = titleSelector
      _filter = filter
    }
  })
  const content = document.querySelector(_contentSelector);
  const title = document.querySelector(_titleSelector).innerText
  const filter = new Function('html', _filter) // 传入html参数，filter里面过滤，返回过滤后的html
  // 1、判断查询结果
  console.log("hooks收到", request, sender);
  if (!content || !title) { // 失败，直接结束
    sendResponse({ isSuccess: false });
    return alert("查找失败，不支持该网站网站，请配置规则！");
  }
  // 2、成功执行filter
  let html = content.outerHTML;
  html = filter(html)
  // 3、获取pre标签的text
  const preTexts = []
  const preDoms = [...content.querySelectorAll('pre code')]
  preDoms.forEach(item => preTexts.push(item.innerText))
  console.log('查询结果', content, title, html, preTexts)
  // 4、返回response
  sendResponse({ html, title, preTexts, isSuccess: true });
}