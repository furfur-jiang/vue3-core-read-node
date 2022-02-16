# vue3 shared工具源码阅读

阅读文件：
  **packages/shared/src/index.ts**

附有注释笔记

阅读时参考自：https://juejin.cn/post/6994976281053888519








# @vue/runtime-dom

``` js
import { h, createApp } from '@vue/runtime-dom'

const RootComponent = {
  render() {
    return h('div', 'hello world')
  }
}

createApp(RootComponent).mount('#app')
```
