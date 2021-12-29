<template>
  <a-tabs tab-position="top" type="card">
    <a-tab-pane key="1" tab="属性定义">
      <Properties />
    </a-tab-pane>
    <a-tab-pane key="2" tab="功能定义">
      <Functions />
    </a-tab-pane>
    <a-tab-pane key="3" tab="事件定义">
      <Events />
    </a-tab-pane>
    <a-tab-pane key="4" tab="标签定义">
      <Tags />
    </a-tab-pane>
    <template #tabBarExtraContent>
      <a-space>
        <a-button>快速导入</a-button>
        <a-button>物模型TSL</a-button>
      </a-space>
    </template>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Properties from './properties/index.vue'
import Functions from './functions/index.vue'
import Events from './events/index.vue'
import Tags from './tags/index.vue'
export default defineComponent({
  components: { Events, Properties, Functions, Tags },
  setup () {
    return {}
  }
})
</script>
