<template>
  <page-container title="用户管理">
    <BaseCrud :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="用户列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
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
          <a @click="authorizeBtn(record)">赋权</a>
          <template v-if="record.status === 1">
            <a-popconfirm
              title="确认禁用?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="enableOrDisable(record)"
            >
              <a>禁用</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确认启用?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="enableOrDisable(record)"
            >
              <a>启用</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="delBtn(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </a-space>
      </template>
    </BaseCrud>
    <Authorization v-model="visible" :data="current" />
  </page-container>
</template>

<script lang="ts">
import Authorization from '@/components/Authorization/index.vue'
import { defineComponent, reactive, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import BaseService from '@/utils/base-service'
import { message } from 'ant-design-vue'
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
    BaseCrud,
    Authorization
  },
  setup () {
    const service = new BaseService<UserItem>('user')
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        search: true,
        searchParams: {
          transform: (value: string) => ({ name$LIKE: value })
        }
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        search: true,
        searchParams: {
          transform: (value: string) => ({ username$LIKE: value })
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
          label: '姓名',
          formItemOptions: {
            type: 'input'
          }
        },
        {
          formItemOptions: {
            type: 'input',
            placeholder: '请输入',
            disabled: false
          },
          rules: {
            required: true,
            trigger: 'blur',
            message: '请输入'
          },
          name: 'username',
          label: '用户名'
        },
        {
          formItemOptions: {
            type: 'input',
            inputTypes: 'password'
          },
          name: 'password',
          rules: {
            required: true,
            trigger: 'blur',
            message: '请输入'
          },
          label: '密码'
        },
        {
          formItemOptions: {
            type: 'input',
            inputTypes: 'password'
          },
          name: 'confirmPassword',
          label: '确认密码',
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
      id: '',
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
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
    const modalChange = (param: any) => {
      model.value = 'preview'
      const data: UserItem = {
        ...param,
        password: param.password !== '******' ? param.password : undefined,
        confirmPassword: param.confirmPassword !== '******' ? param.confirmPassword : undefined
      }
      service.update(data).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const addBtn = () => {
      FormPar.formItems[1].formItemOptions.disabled = false
      formData.id = ''
      formData.name = ''
      formData.username = ''
      formData.password = ''
      formData.confirmPassword = ''
      model.value = 'add'
    }
    const editBtn = (data: any) => {
      FormPar.formItems[1].formItemOptions.disabled = true
      formData.id = data.id
      formData.name = data.name
      formData.username = data.username
      formData.password = '******'
      formData.confirmPassword = '******'
      model.value = 'edit'
    }
    const delBtn = (id: string) => {
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const enableOrDisable = (data: any) => {
      model.value = 'preview'
      service.update({ id: data.id, status: data.status === 1 ? 0 : 1 }).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          model.value = 'refresh'
        }
      })
    }
    const authorizeBtn = (data: UserItem) => {
      visible.value = true
      current.value = {
        ...data,
        targetType: 'user'
      }
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
      enableOrDisable,
      visible,
      authorizeBtn,
      current
    }
  }
})
</script>
