<template>
  <page-container title="用户管理">
    <BaseCrud :curd-model="CurdModel" :columns="columns" title="用户列表">
      <template #extra>
        <a-space>
          <a-button @click="editForm('add', {})" type="primary">新增</a-button>
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
          <a @click="editForm('edit', record)">编辑</a>
          <a-popconfirm
            title="确认删除?"
            ok-text="确认"
            cancel-text="取消"
            @confirm=delForm(record.id)
          >
            <a>删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </BaseCrud>
    <a-modal v-model:visible="visible" :title="modalTitle" okText="确定" cancelText="取消" @ok="saveForm" @cancel="cancelForm">
      <BaseForm v-model="formRef" :form-par="FormPar" />
    </a-modal>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import curdModel from '@/components/BaseCrud/model.ts'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import BaseForm from '@/components/BaseForm/index.vue'

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
    BaseForm
  },
  setup () {
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
    const model = ref('')
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
            placeholder: '请输入'
            // disabled: (model.value === 'edit')
          },
          rules: {
            required: true
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
            required: true
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
            required: true
          }
        }
      ]
    })
    const CurdModel = curdModel<UserItem>('user')
    const modalTitle = ref<string>('新增')
    const formRef = reactive<UserItem>({
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    })
    const visible = ref<boolean>(false)
    const editForm = (str: string, data: UserItem) => {
      visible.value = true
      model.value = str
      if (str === 'add') {
        modalTitle.value = '新增'
        formRef.name = ''
        formRef.username = ''
        formRef.password = ''
        formRef.confirmPassword = ''
      } else {
        modalTitle.value = '编辑'
        formRef.name = data.name
        formRef.username = data.username
        formRef.password = '******'
        formRef.confirmPassword = '******'
      }
    }
    const delForm = (id: string) => {
      CurdModel.remove(id)
    }
    const cancelForm = () => {
      model.value = ''
      formRef.name = ''
      formRef.username = ''
      formRef.password = ''
      formRef.confirmPassword = ''
      visible.value = false
    }
    const saveForm = () => {
      const data: UserItem = {
        ...formRef,
        password: formRef.password !== '******' ? formRef.password : undefined,
        confirmPassword: formRef.confirmPassword !== '******' ? formRef.confirmPassword : undefined
      }
      CurdModel.update(data)
      cancelForm()
    }
    return {
      columns,
      CurdModel,
      editForm,
      saveForm,
      cancelForm,
      delForm,
      FormPar,
      modalTitle,
      formRef,
      visible
    }
  }
})
</script>
