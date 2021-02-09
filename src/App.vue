<template>
  <div></div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { copy, getStoreConfigWebsites, setStoreConfigWebsites, createMenu, initStoreConfigWebsites } from "./app.ts";

export default defineComponent({
  name: "App",
  setup () {
    onMounted(() => {
      window._fns = { getStoreConfigWebsites, setStoreConfigWebsites } // 创建全局对象，方便popup调用
      createMenu() // 创建右键菜单
      initStoreConfigWebsites() // 初始化默认数据
    });
  },
});
</script>

<style>
</style>
