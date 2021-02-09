<template>
  <div style="width: 500px;">
    <div>可在下方修改配置，请注意：经测试csdn网站服务器没有权限访问博客园图片。</div>
    <div>由于我主要是用csdn写博客，所以下载的博客园md文章的图片在csdn上加载不出来，提示没有权限。</div>
    <div class="websites">
      <div class="btns">
        <van-button
          icon="minus"
          type="default"
          @click="setStoreConfigWebsitesFromBack()"
        >保存</van-button>
      </div>
      <div class="container">
        <van-field
          v-model="websites.data"
          rows="10"
          autosize
          label="网站配置"
          type="textarea"
          maxlength="5000"
          show-word-limit
        />
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import { websites, getStoreConfigWebsitesFromBack, setStoreConfigWebsitesFromBack } from './app.ts'

export default defineComponent({
  name: "Popup",
  setup () {
    onMounted(() => {
      // 1、获取background、获取storage
      getStoreConfigWebsitesFromBack()
      // 2、
      chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
        alert("前端/后端/Popup收到");
        sendResponse("popup返回值");
      });
      // 3、向background获取storage的websites数据
    });
    return {
      websites,
      setStoreConfigWebsitesFromBack
    }
  },
  methods: {
    alert () {
      alert("from popup");
    },
  },
});
</script>

<style>
textarea{
  width: 100%;
}
</style>
