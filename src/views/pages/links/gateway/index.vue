<template>
  <page-container title="设备网关">
    <BaseCrud @event-change="eventChange" :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="网关列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
        </a-space>
      </template>
      <template #state="slotProps">
        <template v-if="slotProps.value.value === 'enabled'">
          <a-tag color="#108ee9">{{ slotProps.value.text }}</a-tag>
        </template>
        <template v-else>
          <a-tag color="#f50">{{ slotProps.value.text }}</a-tag>
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
    const service = new BaseService<UserItem>('network/config')
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        slots: true
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
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
      paging: false
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
