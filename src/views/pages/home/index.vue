<template>
  <div>
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <Device />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <Message />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <Cpu />
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <Jvm />
        </div>
      </a-col>
    </a-row>
    <DeviceMessage />
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Device from './device/index.vue'
import Message from './message/index.vue'
import Cpu from './cpu/index.vue'
import Jvm from './jvm/index.vue'
import DeviceMessage from './device-message/index.vue'
export default defineComponent({
  components: { Device, Message, Cpu, Jvm, DeviceMessage },
  setup () {
    return {}
  }
})
</script>
