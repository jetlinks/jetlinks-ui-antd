<template>
  <a-card title="关联权限">
    <template #extra>
      <slot name="extra">
        <a-button type="primary" @click="add">新增</a-button>
      </slot>
    </template>
    <a-table :pagination="false" :rowKey="getRowKey" :columns="columns" :data-source="dataSource" bordered>
      <template v-for="col in ['name', 'describe']" #[col]="{ text, record }" :key="col">
        <div>
          <a-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template #operation="{ record }">
        <div class="editable-row-operations">
          <a-space v-if="editableData[record.key]">
            <a @click="save(record.key)">保存</a>
            <a-popconfirm title="确认取消?" ok-text="确认" cancel-text="取消" @confirm="cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </a-space>
          <a-space v-else>
            <a @click="edit(record.key)">编辑</a>
            <a-popconfirm title="确认删除?" ok-text="确认" cancel-text="取消" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, UnwrapRef, watch } from 'vue'
import { uid } from '@/utils/uid'
import _ from 'lodash'
interface DataViewItem {
  key: string,
  describe: string,
  name: string
}
export default defineComponent({
  name: 'DataView',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const columns = [
      {
        title: '字段',
        dataIndex: 'name',
        width: '33%',
        slots: { customRender: 'name' }
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: '33%',
        slots: { customRender: 'describe' }
      },
      {
        title: '操作',
        width: '34%',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ]
    const dataSource = ref(props.modelValue)
    watch(props.modelValue, () => {
      dataSource.value = props.modelValue
    })
    const editableData: UnwrapRef<Record<string, DataViewItem>> = reactive({})
    const add = () => {
      const key = uid()
      const data = {
        key,
        describe: '',
        name: ''
      }
      dataSource.value.push(data)
      editableData[key] = data
    }
    const edit = (key: string) => {
      editableData[key] = _.cloneDeep(dataSource.value.filter((item: DataViewItem) => key === item.key)[0])
    }
    const save = (key: string) => {
      Object.assign(dataSource.value.filter((item: DataViewItem) => key === item.key)[0], editableData[key])
      delete editableData[key]
      emit('update:modelValue', dataSource.value)
    }
    const cancel = (key: string) => {
      delete editableData[key]
    }
    const remove = (key: string) => {
      _.remove(dataSource.value, (n: DataViewItem) => {
        return n.key === key
      })
      emit('update:modelValue', dataSource.value)
    }
    const getRowKey = () => {
      return `data-view${uid()}`
    }
    return {
      dataSource,
      columns,
      editingKey: '',
      editableData,
      edit,
      save,
      cancel,
      remove,
      add,
      getRowKey
    }
  }
})
</script>
