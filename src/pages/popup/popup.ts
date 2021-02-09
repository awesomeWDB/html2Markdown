declare global {
  interface Window {
    chrome: any;
  }
}

import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'

createApp(App).use(Vant).mount('#popup')
