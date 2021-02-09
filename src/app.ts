// import html2markdown from "html2markdown";
// import cheerio from "cheerio";
const html2markdown = require("html2markdown");
const cheerio = require("cheerio");
import { setStore, getStore } from "@/utils/store";
import iconv from "iconv-lite";
// import {BufferBigEndian} from '@/utils/bufferBigEndian.ts'
import { str2ab } from "@/utils/index.ts";

declare global {
  interface Window {
    chrome: any;
    _fns: any // 用于存储插件相关的对象
  }
}
interface cheerio {
  load: Function;
}
export const copy = ({ title, html, preTexts }: { title: string; html: string, preTexts: string[] }) => {
  // 这些写在content里面，通过通信传递数据
  // const content = document.querySelector("#content_views");
  // console.log(content);
  // console.log(content);
  // if (!content) return alert("查找失败！"); // 失败，直接结束
  // // body = iconv.decode(body, "utf-8"); // 解码
  // const html = content.outerHTML;
  const $ = cheerio.load(html, { decodeEntities: false }); // 类似jquery的操作，并且加参数，不然获取的是类似的字符：&#x5B8C;&#x6210;&#x5EA6;
  const $target = $.root(); // 获取目标
  // 处理
  $target.find("svg").remove(); // 处理
  $target.find(".hljs-button").remove(); // 处理1：移除代码的登录 // 不需要，这个是浏览器加载后执行生成的，在抓取的原始页面中没有
  $target.find(".pre-numbering").remove(); // 处理2：移除代码的行数 // 不需要，这个是浏览器加载后执行生成的，在抓取的原始页面中没有
  $target.find(".hljs-ln-numbers").remove(); // 处理3：移除代码的行数
  $target.find("pre").each((index: number, elem: any) => { // 处理4：处理pre标签的内容text
    $(elem).html('￥￥￥￥')// 放置一个标记位
  })
  console.log("############################################");
  let markdown = html2markdown($target.html());
  markdown = markdown.replace(/[\s\n\t]+```/g, "\n```").replace(/[\s\n\t]{0,}[\n]+/g, '\n'); // 格式化1
  let index = -1 // 标志了第几次替换，对应preTexts的下标
  markdown = markdown.replace(/￥￥￥￥/g, () => { // 填充pre-text
    index++
    return preTexts[index]
  })
  console.log(markdown, '#####', preTexts);
  // const buf = new BufferBigEndian()
  // buf.pushStringWithUtf8(markdown);
  const buffer = str2ab(markdown);

  const blob = new Blob([buffer], { type: "text/plain" });
  //const blob = new Blob([data], {type: 'audio/wav'})
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${title}.md`; // 这里填保存成的文件名
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};

export const createMenu = () => {
  const chrome = window.chrome;
  chrome.contextMenus.create({
    title: "blog to markdown",
    onclick: function () {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        let message = { task: "copy", configure: { websites: getStoreConfigWebsites() } };
        chrome.tabs.sendMessage(tabs[0].id, message, ({ title, html, isSuccess, preTexts }: { title: string; html: string; isSuccess: boolean; preTexts: string[] }) => {
          if (!isSuccess) return console.info("下载失败！");
          copy({ title, html, preTexts });
        });
      });
    }
  });
}

export const getStoreConfigWebsites = () => {
  return getStore({ name: 'websites' })
}

export const setStoreConfigWebsites = (content: any[]) => {
  const name = 'websites'
  const type = false
  return setStore({ name, content, type })
}

// csdn,博客园，简书
export const defaultConfigWebsites = [
  {
    url: '/blog.csdn.net/',
    contentSelector: '#content_views',
    titleSelector: '#articleContentId',
    filter: `return html`
  },
  {
    "url": "/www.cnblogs.com/",
    "contentSelector": "#cnblogs_post_body",
    "titleSelector": ".postTitle",
    filter: `return html`
  },
  {
    "url": "/www.jianshu.com/",
    "contentSelector": "._2rhmJa",
    "titleSelector": "._1RuRku",
    filter: `return html.replaceAll("//upload-images.jianshu.io", "https://upload-images.jianshu.io") // 简书的图片需要特殊处理`
  }
]

export const initStoreConfigWebsites = () => {
  console.log(getStoreConfigWebsites())
  if (getStoreConfigWebsites()) return
  setStoreConfigWebsites(defaultConfigWebsites)
}