<template>
  <a-modal :closable="false" v-model:visible="modalVisible" :width="bindingUserVisible ? 1300 : 650" @ok="okBtn" @cancel="cancelBtn" cancelText="取消" okText="确认">
    <div style="display: flex; justify-content: space-around;">
      <a-card title="已绑定用户" :style="{ width: bindingUserVisible ? '50%' : '100%'}">
        <template #extra>
          <a-button type="primary" @click="bindBtn">绑定用户</a-button>
        </template>
        <div style="margin-bottom: 20px">
          <a-input-search
            placeholder="请输入姓名"
            style="width: 250px"
            @search="handleBoundSearch"
          />
        </div>
        <template v-if="selectedBoundRowKeys.length > 0">
          <a-alert type="info">
            <template #message>
              <div style="display: flex; width: 100%; justify-content: space-between;">
                <a-space>
                  <span>已选{{ selectedBoundRowKeys.length }}项</span>
                  <a @click="cancelChoose('bind')">取消选择</a>
                </a-space>
                <a @click="unbindUsers">批量解绑</a>
              </div>
            </template>
          </a-alert>
        </template>
        <a-table
          @change="handleTableBoundChange"
          :pagination="{
             pageSize: boundUserData.pageSize,
             showQuickJumper: false,
             showSizeChanger: false,
             total: boundUserData.total,
             showTotal: (total) => `共${total}条记录`
           }"
          rowKey="id"
          :row-selection="rowBoundSelection"
          :dataSource="boundUserData.data"
          :columns="columns" />
      </a-card>
      <template v-if="bindingUserVisible">
        <a-card title="绑定新用户" style="width: 49%">
          <template #extra>
            <CloseOutlined @click="bindingUserVisible = false" />
          </template>
          <div style="margin-bottom: 20px">
            <a-input-search
              placeholder="请输入姓名"
              style="width: 250px"
              @search="handleBindingSearch"
            />
          </div>
          <template v-if="selectedBindingRowKeys.length > 0">
            <a-alert type="info" @close="bindUsers">
              <template #message>
                <div style="display: flex; width: 100%; justify-content: space-between;">
                  <a-space>
                    <span>已选{{ selectedBindingRowKeys.length }}项</span>
                    <a @click="cancelChoose('unbind')">取消选择</a>
                  </a-space>
                  <a @click="bindUsers">批量绑定</a>
                </div>
              </template>
            </a-alert>
          </template>
          <a-table
            rowKey="id"
            :row-selection="rowBindingSelection"
            :dataSource="bindingUserData.data"
            :columns="columns"
            @change="handleTableBindingChange"
            :pagination="{
               pageSize: bindingUserData.pageSize,
               showQuickJumper: false,
               showSizeChanger: false,
               total: bindingUserData.total,
               showTotal: (total) => `共${total}条记录`
             }"
          />
        </a-card>
      </template>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { getUserList, bindUser, unbindUser, orgBindUser, orgUnbindUser } from './service'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
import encodeQuery from '@/utils/encodeQuery'
import { CloseOutlined } from '@ant-design/icons-vue'
import { PaginationType } from '@/components/BaseCrud/index.vue'
import { message } from 'ant-design-vue'
type Key = ColumnProps['key']

export default defineComponent({
  name: 'BindUser',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue'],
  components: { CloseOutlined },
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(false)
    const loading = ref<boolean>(true)
    const bindingUserVisible = ref<boolean>(false)
    const boundUserData = reactive({
      data: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0
    })
    const bindingUserData = reactive({
      data: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0
    })
    const selectedBoundRowKeys = reactive<any[]>([])
    const selectedBindingRowKeys = reactive<any[]>([])
    const defaultBoundParam = reactive({
      pageIndex: 0,
      pageSize: 8,
      terms: {}
    })
    const defaultBindingParam = reactive({
      pageIndex: 0,
      pageSize: 8,
      terms: {}
    })
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      }
    ]
    const getBoundSearch = (params: any) => {
      getUserList(encodeQuery(params)).then(resp => {
        if (resp.data.status === 200) {
          Object.assign(boundUserData, resp.data.result)
        }
      })
    }
    const getBindingSearch = (params: any) => {
      getUserList(encodeQuery(params)).then(resp => {
        if (resp.data.status === 200) {
          Object.assign(bindingUserData, resp.data.result)
        }
      })
    }
    watch(() => props.modelValue, (newValue) => {
      modalVisible.value = newValue
      if (newValue) {
        bindingUserVisible.value = false
        if (props.data.targetType === 'role') {
          defaultBoundParam.terms = {
            'id$in-dimension$role': props.data.id
          }
        } else {
          defaultBoundParam.terms = {
            'id$in-dimension$org': props.data.id
          }
        }
        getBoundSearch(defaultBoundParam)
      }
    })
    const bindBtn = () => {
      bindingUserVisible.value = true
      if (props.data.targetType === 'role') {
        defaultBindingParam.terms = {
          'id$in-dimension$role$not': props.data.id
        }
      } else {
        defaultBindingParam.terms = {
          'id$in-dimension$org$not': props.data.id
        }
      }
      getBindingSearch(defaultBindingParam)
    }
    const okBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const cancelBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const rowBoundSelection = {
      selectedRowKeys: toRaw(selectedBoundRowKeys),
      onChange: (key: Key[]) => {
        selectedBoundRowKeys.splice(0, selectedBoundRowKeys.length)
        Object.assign(selectedBoundRowKeys, key)
      }
    }
    const rowBindingSelection = {
      selectedRowKeys: toRaw(selectedBindingRowKeys),
      onChange: (key: Key[]) => {
        selectedBindingRowKeys.splice(0, selectedBindingRowKeys.length)
        Object.assign(selectedBindingRowKeys, key)
      }
    }
    const handleTableBoundChange = (page: PaginationType) => {
      defaultBoundParam.pageIndex = page.current - 1
      defaultBoundParam.pageSize = 8
      getBoundSearch(defaultBoundParam)
    }
    const handleTableBindingChange = (page: PaginationType) => {
      defaultBindingParam.pageIndex = page.current - 1
      defaultBindingParam.pageSize = page.pageSize
      getBindingSearch(defaultBindingParam)
    }
    const handleBoundSearch = (value: string) => {
      defaultBoundParam.pageIndex = 0
      defaultBoundParam.pageSize = 8
      defaultBoundParam.terms = {
        ...defaultBoundParam.terms,
        name$LIKE: value
      }
      getBoundSearch(defaultBoundParam)
    }
    const handleBindingSearch = (value: string) => {
      defaultBindingParam.pageIndex = 0
      defaultBindingParam.pageSize = 8
      defaultBindingParam.terms = {
        ...defaultBindingParam.terms,
        name$LIKE: value
      }
      getBindingSearch(defaultBindingParam)
    }
    const bindUsers = () => {
      if (props.data.targetType === 'role') {
        const list: any = []
        selectedBindingRowKeys.map(item => {
          const flag = boundUserData.data.find((i: any) => { return i.id === item }) || { name: '' }
          list.push({
            dimensionId: props.data.id,
            dimensionName: props.data.id,
            dimensionTypeId: 'role',
            userId: item,
            userName: flag.name
          })
        })
        bindUser(list).then(resp => {
          if (resp.data.status === 200) {
            message.success('绑定成功！')
            selectedBindingRowKeys.splice(0, selectedBindingRowKeys.length)
            getBoundSearch(defaultBoundParam)
            getBindingSearch(defaultBindingParam)
          }
        })
      } else {
        orgBindUser(props.data.id, selectedBindingRowKeys).then(resp => {
          if (resp.data.status === 200) {
            message.success('绑定成功！')
            selectedBindingRowKeys.splice(0, selectedBindingRowKeys.length)
            getBoundSearch(defaultBoundParam)
            getBindingSearch(defaultBindingParam)
          }
        })
      }
    }
    const unbindUsers = () => {
      if (props.data.targetType === 'role') {
        unbindUser(props.data.id, selectedBoundRowKeys).then(resp => {
          if (resp.data.status === 200) {
            message.success('解绑成功！')
            selectedBoundRowKeys.splice(0, selectedBoundRowKeys.length)
            getBoundSearch(defaultBoundParam)
            getBindingSearch(defaultBindingParam)
          }
        })
      } else {
        orgBindUser(props.data.id, selectedBindingRowKeys).then(resp => {
          if (resp.data.status === 200) {
            message.success('绑定成功！')
            selectedBindingRowKeys.splice(0, selectedBindingRowKeys.length)
            getBoundSearch(defaultBoundParam)
            getBindingSearch(defaultBindingParam)
          }
        })
      }
    }
    const cancelChoose = (bind: string) => {
      if (bind === 'bind') {
        selectedBoundRowKeys.splice(0, selectedBoundRowKeys.length)
      } else {
        selectedBindingRowKeys.splice(0, selectedBindingRowKeys.length)
      }
    }
    return {
      modalVisible,
      columns,
      loading,
      okBtn,
      cancelBtn,
      boundUserData,
      handleBoundSearch,
      handleBindingSearch,
      rowBoundSelection,
      rowBindingSelection,
      bindBtn,
      bindingUserData,
      bindingUserVisible,
      handleTableBoundChange,
      handleTableBindingChange,
      selectedBoundRowKeys,
      selectedBindingRowKeys,
      bindUsers,
      unbindUsers,
      cancelChoose
    }
  }
})
</script>
