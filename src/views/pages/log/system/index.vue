<template>
  <page-container title="系统日志">
    <BaseCrud @event-change="eventChange" :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="日志列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
      <template #level="slotProps">
        <a-tag color="orange">{{ slotProps.value }}</a-tag>
      </template>
      <template #context="slotProps">
        <span>{{ slotProps.value.server }}</span>
      </template>
      <template #createTime="slotProps">
        <span>{{ $moment(slotProps.value).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template #operation="{ record }">
        <a-space>
          <a @click="editBtn(record)">详情</a>
        </a-space>
      </template>
    </BaseCrud>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import BaseService from '@/utils/base-service'
export interface UserItem {
  id?: string;
  name: string;
  status?: number;
  username: string;
  createTime?: number;
  email?: string;
  telephone?: string;
  avatar?: string;
  description?: string;
  password?: string;
  confirmPassword?: string;
}

export default defineComponent({
  components: {
    BaseCrud
  },
  setup () {
    const service = new BaseService<UserItem>('logger/system')
    const columns = [
      {
        title: '线程',
        dataIndex: 'threadName',
        key: 'threadName'
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
        title: '级别',
        dataIndex: 'level',
        key: 'level',
        slots: true,
        search: {
          mode: 'multiple',
          type: 'select',
          enum: [
            {
              key: 'ERROR',
              label: 'ERROR',
              value: 'ERROR'
            },
            {
              key: 'INFO',
              label: 'INFO',
              value: 'INFO'
            },
            {
              key: 'WARN',
              label: 'WARN',
              value: 'WARN'
            },
            {
              key: 'DEBUG',
              label: 'DEBUG',
              value: 'DEBUG'
            }
          ]
        },
        searchParams: {
          transform: (value: string[]) => ({ level$IN: value.join(',') })
        }
      },
      {
        title: '日志内容',
        dataIndex: 'message',
        key: 'message'
      },
      {
        title: '服务商',
        dataIndex: 'context',
        key: 'context',
        slots: true
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        slots: true
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        slots: true
      }
    ]
    const FormPar = reactive<FormProps>({
      layout: 'vertical',
      formItems: [
        {
          name: 'name',
          rules: {
            trigger: 'blur',
            message: '请输入',
            required: true
          },
          label: '名称',
          formItemOptions: {
            type: 'input'
          }
        },
        {
          formItemOptions: {
            type: 'select',
            placeholder: '请选择',
            enum: [
              {
                label: 'PFX',
                value: 'PFX'
              },
              {
                label: 'JKS',
                value: 'JKS'
              },
              {
                label: 'PEM',
                value: 'PEM'
              }
            ]
          },
          rules: {
            required: true,
            message: '请输入'
          },
          name: 'instance',
          label: '类型'
        },
        {
          formItemOptions: {
            type: 'input'
          },
          name: 'configs.keystoreBase64',
          label: '密钥库'
        },
        {
          formItemOptions: {
            type: 'input'
          },
          name: 'configs.keystorePwd',
          label: '密钥库密码',
          visible: false
        },
        {
          formItemOptions: {
            type: 'input'
          },
          name: 'configs.trustKeyStoreBase64',
          label: '信任库',
          rules: {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        },
        {
          formItemOptions: {
            type: 'input'
          },
          name: 'configs.trustKeyStorePwd',
          label: '信任库密码',
          visible: false
        },
        {
          formItemOptions: {
            type: 'textarea'
          },
          name: 'description',
          label: '描述',
          rules: {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        }
      ]
    })
    const model = ref<'edit' | 'preview' | 'add' | 'refresh'>('preview')
    const formData = reactive({
      name: '',
      instance: '',
      configs: {
        keystorePwd: '',
        keystoreBase64: '',
        trustKeyStoreBase64: '',
        trustKeyStorePwd: ''
      },
      description: '',
      id: undefined
    })
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        createTime: 'desc'
      }
    }
    const modalVisible = (value: 'edit' | 'preview' | 'add' | 'refresh') => {
      model.value = value
    }
    const visible = ref<boolean>(false)
    const current = ref()
    const inspection = (data: any) => {
      if (data.name === 'instance') {
        if (data.value === 'PEM') {
          FormPar.formItems[3].visible = false
          FormPar.formItems[5].visible = false
        } else {
          FormPar.formItems[3].visible = true
          FormPar.formItems[5].visible = true
        }
      }
    }
    const modalChange = (param: any) => {
      model.value = 'preview'
      service.update(param).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const addBtn = () => {
      // formData.id = undefined
      // formData.instance = 'PEM'
      // formData.name = ''
      // formData.configs.keystoreBase64 = ''
      // formData.configs.keystorePwd = ''
      // formData.configs.trustKeyStoreBase64 = ''
      // formData.configs.trustKeyStorePwd = ''
      // formData.description = ''
      // inspection({ value: 'PEM', name: 'instance' })
      // model.value = 'add'
    }
    const editBtn = (data: any) => {
      // formData.id = data.id
      // formData.instance = data.instance
      // formData.name = data.name
      // formData.configs.keystorePwd = data.configs.keystorePwd
      // formData.configs.keystoreBase64 = data.configs.keystoreBase64
      // formData.configs.trustKeyStoreBase64 = data.configs.trustKeyStoreBase64
      // formData.configs.trustKeyStorePwd = data.configs.trustKeyStorePwd
      // formData.description = data.description
      // inspection({ value: data.instance, name: 'instance' })
      // model.value = 'edit'
    }
    const delBtn = (id: string) => {
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const eventChange = (data: any) => {
      inspection(data)
    }
    return {
      columns,
      FormPar,
      service,
      defaultParams,
      model,
      formData,
      addBtn,
      editBtn,
      delBtn,
      modalVisible,
      modalChange,
      visible,
      current,
      eventChange
    }
  }
})
</script>
