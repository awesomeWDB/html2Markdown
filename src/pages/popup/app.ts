import { setStore, getStore } from "@/utils/store";
import { formatJson } from "@/utils/formatJson";
import { reactive } from 'vue'

let bg: any = null

export const websites = reactive({
  data: ''
})

export const getBackGround = () => { // 1、向background获取storage的websites数据
  const chrome = window.chrome;
  bg = chrome.extension.getBackgroundPage(); // 获取background
  console.log(bg)
}

export const getStoreConfigWebsitesFromBack = () => {
  if (!bg) getBackGround()
  const _data = bg._fns.getStoreConfigWebsites()
  websites.data = formatJson(_data) || ''
}

export const setStoreConfigWebsitesFromBack = () => {
  try {
    const content = JSON.parse(websites.data)
    bg._fns.setStoreConfigWebsites(content)
    alert('保存成功！')
  } catch (err) {
    console.log(err)
    alert(err)
  }
}