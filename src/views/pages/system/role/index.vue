<template>
  <page-container title="角色管理">
    <BaseCrud :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="角色列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
        </a-space>
      </template>
      <template #action="{ record }">
        <a-space>
          <a @click="editBtn(record)">编辑</a>
          <a @click="authorizeBtn(record)">权限分配</a>
          <a @click="bindUserBtn(record)">绑定用户</a>
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
    <Authorization v-model="visible" :data="current" />
    <BindUser v-model="bindUserVisible" :data="current" />
  </page-container>
</template>

<script lang="ts">
import Authorization from '@/components/Authorization/index.vue'
import BindUser from '@/components/BindUser/index.vue'
import { defineComponent, reactive, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import BaseService from '@/utils/base-service'
type RoleItem = {
  id: string;
  level: number;
  name: string;
  path: string;
  sortIndex: number;
  typeId: string;
  describe: string | undefined;
}

export default defineComponent({
  components: {
    BaseCrud,
    Authorization,
    BindUser
  },
  setup () {
    const service = new BaseService<RoleItem>('dimension')
    const columns = [
      {
        title: '标识',
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
        title: '描述',
        dataIndex: 'describe',
        key: 'describe'
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
          name: 'id',
          rules: {
            trigger: 'blur',
            message: '请输入',
            required: true
          },
          label: '角色标识',
          formItemOptions: {
            type: 'input'
          }
        },
        {
          formItemOptions: {
            type: 'input',
            placeholder: '请输入'
          },
          rules: {
            required: true,
            trigger: 'blur',
            message: '请输入'
          },
          name: 'name',
          label: '角色名称'
        },
        {
          formItemOptions: {
            type: 'textarea'
          },
          name: 'describe',
          label: '描述'
        }
      ]
    })
    const model = ref<'edit' | 'preview' | 'add' | 'refresh'>('preview')
    const formData = reactive({
      id: '',
      level: '',
      name: '',
      path: '',
      sortIndex: '',
      typeId: '',
      describe: ''
    })
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10,
      terms: {
        typeId: 'role'
      },
      sorts: {
        id: 'desc'
      }
    }
    const modalVisible = (value: 'edit' | 'preview' | 'add' | 'refresh') => {
      model.value = value
    }
    const modalChange = (params: any) => {
      params.typeId = 'role'
      service.update(params).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const addBtn = () => {
      formData.id = ''
      formData.name = ''
      formData.describe = ''
      model.value = 'add'
    }
    const editBtn = (data: any) => {
      formData.id = data.id
      formData.name = data.name
      formData.describe = data.describe
      model.value = 'edit'
    }
    const delBtn = (id: string) => {
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const visible = ref<boolean>(false)
    const current = ref<any>()
    const authorizeBtn = (data: RoleItem) => {
      visible.value = true
      current.value = {
        id: data.id,
        name: data.name,
        targetType: 'role'
      }
    }
    const bindUserVisible = ref<boolean>(false)
    const bindUserBtn = (data: RoleItem) => {
      bindUserVisible.value = true
      current.value = {
        id: data.id,
        name: data.name,
        targetType: 'role'
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
      visible,
      current,
      authorizeBtn,
      bindUserBtn,
      bindUserVisible
    }
  }
})
</script>
