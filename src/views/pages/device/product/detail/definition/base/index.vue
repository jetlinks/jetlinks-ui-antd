
<template>
  <a-card>
    <template #title>
      <a-input-search allowClear v-model:value="searchValue" placeholder="请输入名称" style="width: 250px" @search="onSearch"/>
    </template>
    <template #extra>
      <slot name="extra">
        <a-button type="primary">新增</a-button>
      </slot>
    </template>
    <a-table
      rowKey="id"
      :dataSource="dataSource.data"
      :columns="columns"
      @change="handleTableChange"
      :pagination="{
         pageSize: dataSource.pageSize,
         showQuickJumper: false,
         showSizeChanger: false,
         total: dataSource.total,
         current: dataSource.pageIndex,
         showTotal: (total) => `共${total}条记录`
       }">
      <template #action>
        <a-space>
          <a>编辑</a>
          <a-popconfirm
            title="确认删除?"
            ok-text="确认"
            cancel-text="取消"
          >
            <a>删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { inject, defineComponent, ref, reactive, watchEffect, PropType } from 'vue'
import { PaginationType, ColumnType } from '@/components/BaseCrud/index.vue'
export default defineComponent({
  name: 'BaseMetadata',
  props: {
    columns: {
      type: Array as PropType<ColumnType[]>,
      required: true
    },
    type: {
      type: String,
      default: '列表'
    }
  },
  setup (props) {
    const basicInfo: any = inject('basicInfo') || {
      metadata: '{"events":[],"properties":[],"functions":[],"tags":[]}'
    }
    const properties = ref(basicInfo.metadata ? JSON.parse(basicInfo.metadata)[props.type] : [])
    const dataSource = reactive({
      data: properties.value.slice(0, 10),
      pageSize: 10,
      pageIndex: 1,
      total: properties.value.length
    })
    const searchValue = ref<string>('')
    const handleSearch = (pageIndex: number, searchValue: string) => {
      const list = searchValue && searchValue !== '' ? properties.value.filter((item: any) => {
        return item.name.indexOf(searchValue) !== -1
      }) : properties.value
      dataSource.data = list.slice((pageIndex - 1) * 10, pageIndex * 10)
      dataSource.total = list.length
      dataSource.pageIndex = pageIndex
    }
    watchEffect(() => {
      handleSearch(1, '')
    })
    const onSearch = (searchValue: string) => {
      handleSearch(1, searchValue)
    }
    const handleTableChange = (page: PaginationType) => {
      handleSearch(page.current, searchValue.value)
    }
    return {
      dataSource,
      onSearch,
      handleTableChange,
      searchValue
    }
  }
})
</script>
