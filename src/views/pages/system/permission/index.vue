<template>
  <page-container title="权限管理">
    <BaseCrud :model-visible="false" :form-data="{}" :model="model" :columns="columns" title="权限列表" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
          <a-upload
            action='http://demo.jetlinks.cn/jetlinks/file/static'
            :headers="headers"
            :showUploadList="false"
            accept=".json"
            :before-upload="importBtn"
          >
            <a-button><ImportOutlined />导入</a-button>
          </a-upload>
          <a-button @click="exportBtn"><ExportOutlined />导出</a-button>
        </a-space>
      </template>
      <template #status="slotProps">
        <template v-if="slotProps.value === 1">
          <a-tag color="#108ee9">正常</a-tag>
        </template>
        <template v-else>
          <a-tag color="#f50">禁用</a-tag>
        </template>
      </template>
      <template #action="{ record }">
        <a-space>
          <a @click="editBtn(record)">编辑</a>
          <a-popconfirm
            title="确认删除?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="delBtn(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </BaseCrud>
  </page-container>
  <Save v-model="visible" :data="current" @ok-btn="okBtn" />
</template>

<script lang="ts">
import { downloadObject, headers } from '@/utils/utils'
import { defineComponent, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import Save from './save/index.vue'
import BaseService from '@/utils/base-service'
import { message } from 'ant-design-vue'
export type PermissionItem = {
  id: string;
  name: string;
  parents: any[];
  actions: any[];
  properties: any;
  status?: number;
  optionalFields: any[]
};

export default defineComponent({
  components: {
    BaseCrud,
    Save
  },
  setup () {
    const service = new BaseService<PermissionItem>('permission')
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: true,
        searchParams: {
          transform: (value: string) => ({ id$LIKE: value })
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: true,
        searchParams: {
          transform: (value: string) => ({ name$LIKE: value })
        }
      },
      {
        title: '状态',
        slots: true,
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        slots: true
      }
    ]
    const visible = ref<boolean>(false)
    const current = ref()
    const model = ref<'edit' | 'preview' | 'add' | 'refresh'>('preview')
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        createTime: 'desc'
      }
    }
    const addBtn = () => {
      visible.value = true
      model.value = 'add'
      current.value = {
        id: '',
        name: '',
        status: 1,
        properties: {
          type: []
        },
        parents: [],
        actions: [],
        optionalFields: []
      }
    }
    const editBtn = (data: any) => {
      visible.value = true
      model.value = 'edit'
      current.value = data
    }
    const okBtn = (data: any) => {
      service.update(data).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功')
          model.value = 'refresh'
        }
      })
    }
    const delBtn = (id: string) => {
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const importBtn = (file: any) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (result: any) => {
        try {
          const data = JSON.parse(result.target.result)
          service.update(data).then(resp => {
            if (resp.data.status === 200) {
              message.success('操作成功')
              model.value = 'refresh'
            }
          })
        } catch (error) {
          message.error('导入失败，请重试！')
        }
      }
    }
    const exportBtn = () => {
      service.queryNoPaging({}).then(resp => {
        if (resp.data.status === 200) {
          downloadObject(resp.data.result, '权限数据')
          message.success('导出成功')
        } else {
          message.error('导出错误')
        }
      })
    }
    return {
      columns,
      service,
      defaultParams,
      model,
      addBtn,
      editBtn,
      delBtn,
      visible,
      okBtn,
      current,
      importBtn,
      exportBtn,
      headers
    }
  }
})
</script>
