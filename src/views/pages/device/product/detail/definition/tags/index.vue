<template>
  <BaseMetadata type="tags" :columns="columns" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseMetadata from '@/views/pages/device/product/detail/definition/base/index.vue'
export default defineComponent({
  components: { BaseMetadata },
  setup () {
    const columns = [
      {
        title: '标签标识',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '数据类型',
        dataIndex: 'valueType.type',
        key: 'valueType.type'
      },
      {
        title: '是否只读',
        dataIndex: 'expands.readOnly',
        key: 'expands.readOnly'
      },
      {
        title: '说明',
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
