<template>
  <a-modal :width="900" title="新增权限" v-model:visible="modalVisible" cancelText="取消" okText="确认" @ok="okBtn" @cancel="cancelBtn">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="基本信息">
        <a-form :model="form" :rules="rules" layout="vertical">
          <a-form-item label="权限标识（ID)" name="id">
            <a-input v-model:value="form.id" placeholder="只能由字母数字下划线组成" />
          </a-form-item>
          <a-form-item label="权限名称" name="name">
            <a-input v-model:value="form.name" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="form.status" button-style="solid">
              <a-radio-button :value="1">启 用</a-radio-button>
              <a-radio-button :value="0">禁 用</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="分类" :name="['properties', 'type']">
            <a-select :mode="'multiple'" v-model:value="form.properties.type" placeholder="请选择">
              <template v-for="item in permissionType" :key="item.id">
                <a-select-option :value="item.id">{{ item.text }}</a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="操作配置">
        <Action v-model="actions" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="关联权限">
        <Association v-model="association" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="数据视图">
        <DataView v-model="dataView" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, reactive, watch, toRaw } from 'vue'
import Action from './action.vue'
import Association from './association.vue'
import DataView from './data-view.vue'
interface DataItem {
  action: string;
  describe: string;
  name?: string;
  properties?: any;
  key?: string;
  defaultCheck?: boolean;
}
interface AssociationPermissionItem {
  key: string;
  preActions: string[] | any[];
  permission: string;
  actions: string[] | any[];
}
interface DataViewItem {
  key: string,
  describe: string,
  name: string
}
export default defineComponent({
  name: 'Save',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue', 'ok-btn'],
  components: { Action, Association, DataView },
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(false)
    const actions = reactive<DataItem[]>([
      { key: 'query', action: 'query', describe: '查询列表', name: '查询列表', defaultCheck: true },
      { key: 'get', action: 'get', describe: '查询明细', name: '查询明细', defaultCheck: true },
      { key: 'add', action: 'add', describe: '新增', name: '新增', defaultCheck: true },
      { key: 'update', action: 'update', describe: '修改', name: '修改', defaultCheck: true },
      { key: 'delete', action: 'delete', describe: '删除', name: '删除', defaultCheck: true },
      { key: 'import', action: 'import', describe: '导入', name: '导入', defaultCheck: true },
      { key: 'export', action: 'export', describe: '导出', name: '导出', defaultCheck: true }
    ])
    const activeKey = ref<'1' | '2' | '3' | '4'>('1')
    const association = reactive<AssociationPermissionItem[]>([])
    const dataView = reactive<DataViewItem[]>([])
    const permissionType = [
      { id: 'default', text: '默认' },
      { id: 'system', text: '系统' },
      { id: 'business', text: '业务功能' },
      { id: 'api', text: 'API接口' },
      { id: 'tenant', text: '多租户' }
    ]
    const form = reactive({
      id: '',
      name: '',
      status: '',
      properties: {
        type: []
      }
    })
    const rules = {
      id: [{ required: true, message: '请输入ID' }],
      name: [{ required: true, message: '请输入名称' }],
      status: [{ required: true, message: '请选择' }]
    }
    watchEffect(() => {
      Object.assign(form, props.data)
    })
    watch(() => props.modelValue, (newValue) => {
      modalVisible.value = newValue
    })
    watchEffect(() => {
      if (props.data && Object.keys(props.data).length > 0) {
        actions.splice(0, actions.length)
        dataView.splice(0, dataView.length)
        association.splice(0, association.length)
        Object.assign(actions, props.data.actions)
        Object.assign(dataView, props.data.optionalFields)
        Object.assign(association, props.data.parents)
      }
    })
    const okBtn = () => {
      const data = {
        ...form,
        properties: toRaw(form.properties),
        actions: toRaw(actions),
        optionalFields: toRaw(dataView),
        parents: toRaw(association),
        status: props.data?.status || 1
      }
      activeKey.value = '1'
      emit('ok-btn', data)
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const cancelBtn = () => {
      modalVisible.value = false
      activeKey.value = '1'
      emit('update:modelValue', false)
    }
    return {
      permissionType,
      form,
      rules,
      modalVisible,
      okBtn,
      cancelBtn,
      actions,
      association,
      dataView,
      activeKey
    }
  }
})
</script>
