<template>
  <a-row :gutter="16">
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <a-card title="当前在线" style="width: 100%">
          <template #extra><SyncOutlined /></template>
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <a-card title="今日设备消息量" style="width: 100%">
          <template #extra><SyncOutlined /></template>
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <a-card title="CPU使用率" style="width: 100%">
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </div>
    </a-col>
    <a-col class="gutter-row" :span="6">
      <div class="gutter-box">
        <a-card title="JVM内存" style="width: 100%">
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    return {}
  }
})
</script>
