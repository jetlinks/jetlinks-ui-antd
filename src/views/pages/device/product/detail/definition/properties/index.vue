<template>
  <BaseMetadata type="properties" :columns="columns">
    <template #extra>
      <a-space>
        <a-button>导入属性</a-button>
        <a-button type="primary" @click="addBtn">新增</a-button>
      </a-space>
    </template>
  </BaseMetadata>
  <Save v-model="visible" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseMetadata from '@/views/pages/device/product/detail/definition/base/index.vue'
import Save from './save/index.vue'
export default defineComponent({
  components: { BaseMetadata, Save },
  setup () {
    const columns = [
      {
        title: '属性标识',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '数据类型',
        dataIndex: 'valueType.type',
        key: 'valueType.type'
      },
      {
        title: '属性值来源',
        dataIndex: 'expands.source',
        key: 'expands.source'
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
    const visible = ref<boolean>(false)
    const addBtn = () => {
      visible.value = true
    }
    return {
      visible,
      columns,
      addBtn
    }
  }
})
</script>
