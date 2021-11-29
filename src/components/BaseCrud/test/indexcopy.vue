<template>
  <a-card v-if="searchList.length > 0">
    <SearchForm :columns="searchList" @onSearch="onSearch" />
  </a-card>
  <a-card :title="title" style="margin-top: 20px;">
    <template #extra>
      <slot name="extra"></slot>
    </template>
    <a-table
       rowKey="id"
       :dataSource="dataSource.data"
       :loading="false"
       @change="handleTableChange"
       :pagination="{
         pageSize: dataSource.pageSize,
         pageSizeOptions: ['10', '20', '30', '40'],
         showQuickJumper: false,
         showSizeChanger: true,
         total: dataSource.total,
         showTotal: (total) => `共${total}条记录`
       }">
      <template v-for="item in columns" :key="item.key">
        <a-table-column :title="item.title" :data-index="item.dataIndex">
          <template #default="{ record }">
            <template v-if="item.slots">
              <slot :name="item.dataIndex" :record="record" :item="item" :value="record[item.dataIndex]"></slot>
            </template>
            <template v-else>
              <span>{{ record[item.dataIndex] }}</span>
            </template>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, PropType, reactive } from 'vue'
import SearchForm from '@/components/SearchForm/index.vue'
import BaseService from '@/utils/base-service'
import { ModalProps } from 'ant-design-vue/lib/modal/Modal'
import { paginationProps } from 'ant-design-vue/lib/pagination/index';

export type ColumnType = {
  title: string;
  dataIndex: string;
  key: string;
  enum: any[];
  sorter?: boolean;
  sortDirections?: string[];
  defaultSortOrder?: string;
  filterMultiple?: string[] | boolean;
  search?: boolean;
  searchParams?: any;
  slots?: boolean;
}
const props = defineProps({
  columns: { // 表格columns
    type: Array as PropType<ColumnType[]>,
    required: true
  },
  service: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: '列表'
  },
  schema: {
    required: true
  },
  modelConfig: {
    type: Object as PropType<ModalProps>
  },
  defaultParams: {
    type: Object as PropType<Record<string, any>>
  },
  curdModel: {
    type: Object,
    required: true
  },
  pagination: {
    type: Boolean || Object as PropType<typeof paginationProps>
  }
})
const curdModel = reactive(props.curdModel)
const { service, dataSource, query, handleTableChange } = curdModel
const searchList = reactive<Array<any>>([])

onMounted(async () => {
  props.columns.filter(i => i.search).forEach(item => {
    searchList.push({
      type: 'string',
      label: item.title,
      value: '',
      key: item.key,
      transform: item.searchParams?.transform
    })
  })
  query({ pageSize: 10, pageIndex: 0 })
})

const onSearch = (params: any) => {
  if (params) {
    query({
      terms: { ...params },
      pageSize: 10,
      pageIndex: 0
    })
  } else {
    query({
      pageSize: 10,
      pageIndex: 0
    })
  }
}
</script>
