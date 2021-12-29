<template>
  <BaseMetadata type="events" :columns="columns" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseMetadata from '@/views/pages/device/product/detail/definition/base/index.vue'
export default defineComponent({
  components: { BaseMetadata },
  setup () {
    const columns = [
      {
        title: '事件标识',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '事件级别',
        dataIndex: 'expands.level',
        key: 'expands.level'
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        slots: { customRender: 'action' }
      }
    ]
    return {
      columns
    }
  }
})
</script>
