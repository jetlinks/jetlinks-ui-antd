<template>
  <a-card v-if="searchList.length > 0">
    <SearchForm :columns="searchList" @onSearch="handleSearch" />
  </a-card>
  <a-card :title="title" style="margin-top: 20px;">
    <template #extra>
      <slot name="extra"></slot>
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
  <template v-if="form && modelVisible">
    <a-modal :width="600" @cancel="formCancel" v-model:visible="visible" :title="modalTitle" okText="确定" cancelText="取消" @ok="formOk">
      <a-form :layout="form.layout">
        <template v-for="item in form.formItems" :key="item.name">
          <template v-if="item.visible !== false">
            <a-form-item :label="item.label" :name="(item.name).indexOf('.') !== -1 ? item.name.split('.') : item.name" v-bind="validateInfos[item.name]">
              <template v-if="item.formItemOptions.type === 'upload'">
                <FormUpload v-model:value="formRef[item.name]" />
              </template>
              <template v-if="item.formItemOptions.type === 'input'">
                <a-input
                  @change="eventChange($event.target.value, item.name)"
                  :disabled="item.formItemOptions.disabled"
                  :type="item.formItemOptions.inputTypes"
                  v-bind:value="setInputValue(item.name)"
                  :placeholder="item.formItemOptions.placeholder" />
              </template>
              <template v-if="item.formItemOptions.type === 'select'">
                <a-select @change="eventChange($event, item.name)" v-bind:value="setInputValue(item.name)" :placeholder="item.formItemOptions.placeholder">
                  <template v-for="option in item.formItemOptions.enum" :key="option.value">
                    <a-select-option :value="option.value">{{ option.label }}</a-select-option>
                  </template>
                </a-select>
              </template>
              <template v-if="item.formItemOptions.type === 'date'">
                <a-date-picker
                  v-model:value="formRef[item.name]"
                  show-time
                  type="date"
                  :placeholder="item.formItemOptions.placeholder"
                  style="width: 100%"
                />
              </template>
              <template v-if="item.formItemOptions.type === 'switch'">
                <a-switch v-bind:checked="setInputValue(item.name)" />
              </template>
              <template v-if="item.formItemOptions.type === 'checkbox'">
                <a-checkbox-group v-bind:value="setInputValue(item.name)" >
                  <template v-for="option in item.formItemOptions.enum" :key="option.value">
                    <a-checkbox :value="option.value">{{ option.label }}</a-checkbox>
                  </template>
                </a-checkbox-group>
              </template>
              <template v-if="item.formItemOptions.type === 'radio'">
                <a-radio-group v-bind:value="setInputValue(item.name)">
                  <template v-for="option in item.formItemOptions.enum" :key="option.value">
                    <a-radio :value="option.value">{{ option.label }}</a-radio>
                  </template>
                </a-radio-group>
              </template>
              <template v-if="item.formItemOptions.type === 'textarea'">
                <a-textarea @change="eventChange($event.target.value, item.name)" v-bind:value="setInputValue(item.name)" :row="3" />
              </template>
            </a-form-item>
          </template>
        </template>
      </a-form>
    </a-modal>
  </template>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs, watchEffect, toRaw, computed } from 'vue'
import { ModalProps } from 'ant-design-vue/lib/modal/Modal'
import { paginationProps } from 'ant-design-vue/lib/pagination/index'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import encodeQuery from '@/utils/encodeQuery'
import SearchForm from '@/components/SearchForm/index.vue'
import BaseService from '@/utils/base-service'
import { Form } from 'ant-design-vue'
import FormUpload from '@/components/FormUpload/index.vue'

const useForm = Form.useForm
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
    FormUpload
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
    const formRef = reactive(props.formData || {})
    const form = reactive<FormProps>((props.formPar as unknown) as FormProps || {
      formItems: [],
      layout: ''
    })
    const rules: any = reactive({})
    if (form) {
      form.formItems.map((item) => {
        rules[item.name] = [
          {
            ...item.rules
          }
        ]
      })
    }
    const {
      validateInfos,
      resetFields,
      validate
    } = useForm(formRef, rules)
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
      searchList: (props.columns.filter(i => i.search) || []).map(item => {
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
      formOk () {
        validate()
          .then(() => {
            state.visible = false
            emit('modal-visible', 'preview')
            emit('modal-change', toRaw(formRef))
          })
          .catch(err => {
            console.log('error', err)
          })
      },
      addBtn () {
        state.modalTitle = '新增'
        state.visible = true
        Object.assign(formRef, {})
        state.model = 'add'
      }
    })
    onMounted(() => {
      const list = (props.columns.filter(i => i.search) || []).map(item => {
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
    watchEffect(() => {
      if (props.model === 'add') {
        if (Object.keys(props.formData).length > 0) {
          Object.assign(formRef, { ...props.formData })
        }
        state.visible = true
        state.modalTitle = '新增数据'
      } else if (props.model === 'edit') {
        state.visible = true
        state.modalTitle = '编辑数据'
        if (Object.keys(props.formData).length > 0) {
          Object.assign(formRef, { ...props.formData })
        }
      } else if (props.model === 'refresh') {
        state.visible = false
        query(props.defaultParams)
      }
    })
    const setDeepValue = (object: any, path: string[], value: any) => {
      const fieldPath = [...path]
      if (fieldPath.length) {
        const key = fieldPath.shift() || ''
        if (object && object[key]) {
          object[key] = setDeepValue(object[key], fieldPath, value)
        }
      } else {
        object = value
      }
      return object
    }
    const eventChange = ($event: any, name: string) => {
      const value = $event
      if (name.indexOf('.') !== -1) {
        // setDeepValue(toRaw(formRef), name.split('.'), value)
        const arr = name.split('.')
        if (arr.length === 2) {
          formRef[name.split('.')[0]][name.split('.')[1]] = value
        } else if (arr.length === 3) {
          formRef[name.split('.')[0]][name.split('.')[1]][name.split('.')[2]] = value
        }
      } else {
        formRef[name] = value
      }
      emit('event-change', {
        name,
        value: $event
      })
    }
    const setInputValue = computed(() => (name: string) => {
      // eslint-disable-next-line no-eval
      return eval('formRef.' + name)
    })
    return {
      formRef,
      form,
      ...toRefs(state),
      eventChange,
      validateInfos,
      resetFields,
      setInputValue
    }
  }
})
</script>
