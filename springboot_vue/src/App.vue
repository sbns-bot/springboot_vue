<template>
  <div>
    <!--头部-->
    <Header/>
    <!--主体-->
    <div style="display: flex">
    <!--侧边栏-->
      <Aside/>
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>
<style>
</style>
<script>
import Header from "@/components/Header";//导入
import Aside from "@/components/Aside";
export default {//导出
  name: "Layout", components: {
    Header,
    Aside
  }}
</script>

<!--
     APP.vue分成三部分
     1.header(头部) 2.Aside.vue(侧边栏) 3.HomeView.vue(主体)
-->