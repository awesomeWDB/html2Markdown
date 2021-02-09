<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
// import html2markdown from "html2markdown";
// import cheerio from "cheerio";
const html2markdown = require("html2markdown");
const cheerio = require("cheerio");
import iconv from "iconv-lite";
// import {BufferBigEndian} from '@/utils/bufferBigEndian.ts'
import { str2ab } from "@/utils/index.ts";

declare global {
  interface Window {
    chrome: any;
  }
}
interface cheerio {
  load: Function;
}
const copy = ({ title, html }: { title: string; html: string }) => {
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
  $target.find("svg").remove(); // 测试
  $target.find(".hljs-button").remove(); // 处理1：移除代码的登录 // 不需要，这个是浏览器加载后执行生成的，在抓取的原始页面中没有
  $target.find(".pre-numbering").remove(); // 处理2：移除代码的行数 // 不需要，这个是浏览器加载后执行生成的，在抓取的原始页面中没有
  console.log("############################################");
  let markdown = html2markdown($target.html());
  markdown = markdown.replace(/[\s\n\t]+```/g, "\n```");
  console.log(markdown);
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

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      const chrome = window.chrome;
      chrome.contextMenus.create({
        title: "csdn blog to markdown",
        onclick: function () {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs: any) => {
              let message = { task: "copy" };
              chrome.tabs.sendMessage(
                tabs[0].id,
                message,
                ({
                  title,
                  html,
                  isSuccess,
                }: {
                  title: string;
                  html: string;
                  isSuccess: boolean;
                }) => {
                  if (!isSuccess) return console.info("下载失败！");
                  copy({ title, html });
                }
              );
            }
          );
        },
      });
    });
  },
});
</script>

<style>
</style>
