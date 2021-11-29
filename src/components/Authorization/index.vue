<template>
  <a-drawer title="授权" v-model:visible="modalVisible" @close="okBtn" :width="720">
    <a-form :model="form" :rules="rules" layout="vertical" style="margin-bottom: 50px">
      <a-form-item label="被授权主体" name="target">
        <a-input v-model:value="form.target" :disabled="true" />
      </a-form-item>
      <a-form-item label="筛选权限">
        <a-input-group compact>
          <a-select v-model:value="form.type" style="width: 20%" @change="typeChange">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="default">默认</a-select-option>
            <a-select-option value="system">系统</a-select-option>
            <a-select-option value="business">业务功能</a-select-option>
            <a-select-option value="open-api">OpenAPI</a-select-option>
            <a-select-option value="tenant">多租户</a-select-option>
          </a-select>
          <a-input-search @search="onSearch" style="width: 80%" placeholder="请输入权限名称" />
        </a-input-group>
      </a-form-item>
      <a-table rowKey="id" :columns="columns" :pagination="false" :dataSource="permissionList" :loading="loading">
        <template #actions="{ record }">
          <a-checkbox-group v-model:value="checkDimension[record.id]">
            <template v-for="item in record.actions" :key="item.action">
              <a-checkbox :value="item.action">{{item.name}}</a-checkbox>
            </template>
          </a-checkbox-group>
        </template>
        <template #operation="{ record }">
          <a @click="checkCancel(record.id)" v-if="checkDimension[record.id] && record.actions && checkDimension[record.id].length === record.actions.length">取消全选</a>
          <a v-else @click="checkAll(record.id, record.actions)">全选</a>
        </template>
      </a-table>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="okBtn">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { listNoPaging, getAutzSetting, saveAutz } from './service'
import encodeQuery from '@/utils/encodeQuery'
import _ from 'lodash'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'Authorization',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(false)
    const form = reactive({
      target: '',
      type: 'all'
    })
    const loading = ref<boolean>(true)
    const permissionList = reactive([])
    const permissionAllList = reactive([])
    const checkDimension = reactive<any>({})
    const rules = {
      target: [{ required: true, message: '请输入' }]
    }
    const columns = [
      {
        title: '权限名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '权限操作',
        dataIndex: 'actions',
        key: 'actions',
        slots: { customRender: 'actions' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        slots: { customRender: 'operation' }
      }
    ]
    watch(() => props.modelValue, (newValue) => {
      modalVisible.value = newValue
      if (newValue) {
        form.target = props.data.name
        loading.value = true
        listNoPaging().then(resp => {
          if (resp.data.status === 200) {
            const temp: any[] = resp.data.result
            const list = temp.filter(item => (item.actions || []).length > 0)
            Object.assign(permissionAllList, list)
            Object.assign(permissionList, list)
            loading.value = false
          }
        })
      }
    })
    watch(() => props.data, (newValue) => {
      if (newValue) {
        getAutzSetting(encodeQuery({
          paging: false,
          terms: {
            dimensionTarget: props.data.id
          }
        })).then(resp => {
          if (resp.data.status === 200) {
            resp.data.result.map((item: any) => {
              checkDimension[item.permission] = item.actions
            })
          }
        })
      }
    })
    const okBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const checkAll = (id: string, actions: any[]) => {
      checkDimension[id] = _.map(actions, 'action')
    }
    const checkCancel = (id: string) => {
      checkDimension[id] = []
    }
    const typeChange = (e: string) => {
      permissionList.splice(0, permissionList.length)
      if (e === 'all') {
        Object.assign(permissionList, permissionAllList)
      } else {
        const list = permissionAllList.filter((item: any) => {
          return item && item.properties && (item.properties?.type || []).includes(e)
        })
        Object.assign(permissionList, list)
      }
    }
    const onSearch = (searchValue: string) => {
      permissionList.splice(0, permissionList.length)
      const list = permissionAllList.filter((item: any) => {
        return item.name.indexOf(searchValue) !== -1
      })
      Object.assign(permissionList, list)
    }
    const submit = () => {
      const permissionList: any[] = []
      Object.keys(checkDimension).forEach(key => {
        if (toRaw(checkDimension[key]).length > 0) {
          permissionList.push({
            id: key,
            actions: toRaw(checkDimension[key])
          })
        }
      })
      const data = {
        targetId: props.data.id,
        targetType: props.data.targetType,
        permissionList
      }
      saveAutz(data).then(resp => {
        if (resp.data.status === 200) {
          message.success('授权成功')
        }
      })
    }
    return {
      modalVisible,
      okBtn,
      form,
      rules,
      columns,
      permissionList,
      checkDimension,
      checkAll,
      checkCancel,
      submit,
      typeChange,
      onSearch,
      loading
    }
  }
})
</script>
