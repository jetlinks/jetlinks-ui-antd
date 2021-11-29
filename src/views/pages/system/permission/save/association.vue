<template>
  <a-card title="关联权限">
    <template #extra>
      <slot name="extra">
        <a-button type="primary" @click="add">新增</a-button>
      </slot>
    </template>
    <a-table :pagination="false" :rowKey="getRowKey" :columns="columns" :data-source="dataSource" bordered>
      <template v-for="col in ['preActions', 'permission', 'actions']" #[col]="{ text, record }" :key="col">
        <div>
          <template v-if="col === 'preActions' || col === 'actions'">
            <a-select mode="multiple" v-if="editableData[record.key]" v-model:value="editableData[record.key][col]" style="width: 100%" placeholder="请选择">
              <template v-for="item in defaultActionData" :key="item.action">
                <a-select-option :value="item.action">{{ item.describe }}</a-select-option>
              </template>
            </a-select>
            <template v-else>
              <template v-for="item in text" :key="item">
                <a-tag color="green">{{ item }}</a-tag>
              </template>
            </template>
          </template>
          <template v-if="col === 'permission'">
            <a-select v-if="editableData[record.key]" v-model:value="editableData[record.key][col]" style="width: 100%" placeholder="请选择">
              <template v-for="item in permissions" :key="item.id">
                <a-select-option :value="item.id">{{ item.name }}</a-select-option>
              </template>
            </a-select>
            <template v-else>
              <a-tag color="purple">{{ text }}</a-tag>
            </template>
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
import { defineComponent, onMounted, reactive, ref, UnwrapRef, watch } from 'vue'
import { uid } from '@/utils/uid'
import _ from 'lodash'
import { getForGrant } from '../service'
interface AssociationPermissionItem {
  key: string;
  preActions: string[] | any[];
  permission: string;
  actions: string[] | any[];
}
interface PermissionAction {
  action: string;
  describe: string;
  name?: string;
  properties?: any;
  key?: string;
  defaultCheck?: boolean | string;
  checked?: boolean;
}
export default defineComponent({
  name: 'Association',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const defaultActionData: PermissionAction[] = [
      { action: 'query', describe: '查询', defaultCheck: 'true' },
      { action: 'save', describe: '保存', defaultCheck: 'true' },
      { action: 'delete', describe: '删除', defaultCheck: 'false' },
      { action: 'import', describe: '导入', defaultCheck: 'true' },
      { action: 'export', describe: '导出', defaultCheck: 'true' }
    ]
    const columns = [
      {
        title: '前置操作',
        dataIndex: 'preActions',
        width: '25%',
        slots: { customRender: 'preActions' }
      },
      {
        title: '关联权限',
        dataIndex: 'permission',
        width: '25%',
        slots: { customRender: 'permission' }
      },
      {
        title: '关联操作',
        dataIndex: 'actions',
        width: '25%',
        slots: { customRender: 'actions' }
      },
      {
        title: '操作',
        width: '25%',
        dataIndex: 'operation',
        slots: { customRender: 'operation' }
      }
    ]
    const dataSource = ref(props.modelValue)
    watch(props.modelValue, () => {
      dataSource.value = props.modelValue
    })
    const permissions = ref([])
    const editableData: UnwrapRef<Record<string, AssociationPermissionItem>> = reactive({})
    onMounted(() => {
      getForGrant().then(resp => {
        if (resp.data.status === 200) {
          permissions.value = resp.data.result
        }
      })
    })
    const add = () => {
      const key = uid()
      const data = {
        key,
        permission: '',
        actions: [],
        preActions: []
      }
      dataSource.value.push(data)
      editableData[key] = data
    }
    const edit = (key: string) => {
      editableData[key] = _.cloneDeep(dataSource.value.filter((item: AssociationPermissionItem) => key === item.key)[0])
    }
    const save = (key: string) => {
      Object.assign(dataSource.value.filter((item: AssociationPermissionItem) => key === item.key)[0], editableData[key])
      delete editableData[key]
      emit('update:modelValue', dataSource.value)
    }
    const cancel = (key: string) => {
      delete editableData[key]
    }
    const remove = (key: string) => {
      _.remove(dataSource.value, (n: AssociationPermissionItem) => {
        return n.key === key
      })
      emit('update:modelValue', dataSource.value)
    }
    const getRowKey = () => {
      return `association${uid()}`
    }
    return {
      permissions,
      dataSource,
      columns,
      editingKey: '',
      editableData,
      defaultActionData,
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
