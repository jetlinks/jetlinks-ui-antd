<template>
  <a-card v-if="searchList.length > 0">
    <SearchForm :columns="searchList" @onSearch="handleSearch" />
  </a-card>
  <a-card :title="title" style="margin-top: 20px;">
    <template #extra>
      <slot name="extra">
        <a-button @click="addBtn" type="primary">新增</a-button>
      </slot>
    </template>
    <a-table
      :rowKey="rowKey"
      :dataSource="dataSource"
      :loading="loading"
      @change="handleTableChange"
      :pagination="{
         pageSize: pageSize,
         showQuickJumper: false,
         showSizeChanger: false,
         total: total,
         showTotal: (total) => `共${total}条记录`
       }">
      <template v-for="item in columns" :key="item.key">
        <a-table-column :align="item.align" :title="item.title" :data-index="item.dataIndex">
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
  <template v-if="modelVisible">
    <a-modal @cancel="formCancel" :maskClosable="false" v-model:visible="visible" :title="modalTitle" :footer="false">
      <BaseForm @formOk="formOk" @formCancel="formCancel" v-model="formRef" :form-par="formConfig" @eventChange="eventChange"></BaseForm>
    </a-modal>
  </template>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, watch, toRefs, watchEffect } from 'vue'
import { ModalProps } from 'ant-design-vue/lib/modal/Modal'
import { paginationProps } from 'ant-design-vue/lib/pagination/index'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import encodeQuery from '@/utils/encodeQuery'
import SearchForm from '@/components/SearchForm/index.vue'
import BaseForm from '@/components/BaseForm/index.vue'
import BaseService from '@/utils/base-service'
interface EnumState {
  key: string;
  label: string;
  value: string;
  children?: EnumState[]
}
export type SearchProps = {
  enum?: EnumState[];
  type: string;
  mode?: 'multiple' | 'tags' | 'combobox';
}
export type ColumnType = {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: boolean;
  sortDirections?: string[];
  defaultSortOrder?: string;
  filterMultiple?: string[] | boolean;
  search?: boolean | SearchProps;
  searchParams?: any;
  slots?: boolean;
  align?: 'left' | 'right' | 'center';
}
export type PaginationType = {
  current: number;
  pageSize: number;
}
export type SorterType = {
  columnKey: string;
  field: string;
  order: string;
}
export default defineComponent({
  name: 'BaseCrud',
  components: {
    SearchForm,
    BaseForm
  },
  emits: ['modal-change', 'modal-visible', 'event-change'],
  props: {
    model: {
      type: String as PropType<'edit' | 'preview' | 'add' | 'refresh'>,
      default: 'preview'
    },
    title: {
      type: String,
      default: '列表'
    },
    columns: { // 表格columns
      type: Array as PropType<ColumnType[]>,
      required: true
    },
    service: {
      type: Object as PropType<BaseService<any>>,
      required: true
    },
    formPar: {
      type: Object as PropType<FormProps>
    },
    formData: {
      type: Object,
      required: true
    },
    modelVisible: {
      type: Boolean,
      default: true
    },
    modelConfig: {
      type: Object as PropType<ModalProps>
    },
    defaultParams: {
      type: Object as PropType<any>
    },
    pagination: {
      type: Boolean || Object as PropType<typeof paginationProps>
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      loading: true,
      searchParams: {
        sorts: {},
        terms: {}
      },
      rowKey: (record: any) => {
        return record.id ? record.id : String(Math.random() * 10000000)
      },
      visible: false,
      model: 'preview',
      modalTitle: '新增',
      dataSource: [],
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      searchList: props.columns.filter(i => i.search).map(item => {
        return {
          type: typeof item.search === 'object' ? item.search.type : 'string',
          label: item.title,
          value: typeof item.search === 'object' && item.search.mode === 'multiple' ? [] : '',
          enum: typeof item.search === 'object' ? item.search.enum : [],
          key: item.key,
          mode: typeof item.search === 'object' ? item.search.mode : 'combobox',
          transform: item.searchParams?.transform
        }
      }),
      // 搜索
      handleSearch (params: any) {
        if (params) {
          query({
            terms: {
              ...state.searchParams.terms,
              ...params
            },
            sorts: {
              ...state.searchParams.sorts
            },
            pageSize: 10,
            pageIndex: 0
          })
        } else {
          query(props.defaultParams)
        }
      },
      // 当前页变化
      handleTableChange (page: PaginationType, filters: any, sorter: SorterType) {
        query({
          sorts: {
            ...state.searchParams.sorts
          },
          terms: {
            ...state.searchParams.terms
          },
          pageSize: page?.pageSize,
          pageIndex: page?.current - 1
        })
      },
      formCancel () {
        state.visible = false
        Object.assign(formRef, {})
        emit('modal-visible', 'preview')
      },
      formOk (data: any) {
        state.visible = false
        emit('modal-change', data)
        emit('modal-visible', 'preview')
        Object.assign(formRef, data)
      },
      addBtn () {
        state.modalTitle = '新增'
        state.visible = true
        Object.assign(formRef, {})
        state.model = 'add'
      }
    })
    const query = (params: any) => {
      state.loading = true
      state.searchParams = { ...params }
      props.service.query(encodeQuery(params)).then(resp => {
        if (resp.data.status === 200) {
          const result = resp.data.result
          state.dataSource = result.data
          state.pageSize = result.pageSize
          state.total = result.total
          state.pageIndex = result.pageIndex
        }
        state.loading = false
      })
    }
    const formRef = reactive({ ...props.formData })
    const formConfig = reactive({ ...props.formPar })
    onMounted(() => {
      const list = props.columns.filter(i => i.search).map(item => {
        return {
          type: typeof item.search === 'object' ? item.search.type : 'string',
          label: item.title,
          value: typeof item.search === 'object' && item.search.mode === 'multiple' ? [] : '',
          enum: typeof item.search === 'object' ? item.search.enum : [],
          key: item.key,
          mode: typeof item.search === 'object' ? item.search.mode : 'combobox',
          transform: item.searchParams?.transform
        }
      })
      state.searchList = list
      query(props.defaultParams)
    })
    watch(() => props.formData, (newValue) => {
      Object.assign(formRef, newValue)
    }, {
      deep: true
    })
    watchEffect(() => {
      if (props.model === 'add') {
        state.visible = true
        state.modalTitle = '新增'
      } else if (props.model === 'edit') {
        state.visible = true
        state.modalTitle = '编辑'
      } else if (props.model === 'refresh') {
        state.visible = false
        query(props.defaultParams)
      }
    })
    const eventChange = (data: any) => {
      emit('event-change', data)
    }
    return {
      formRef,
      formConfig,
      ...toRefs(state),
      eventChange
    }
  }
})
</script>
