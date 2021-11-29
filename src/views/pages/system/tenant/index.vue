<template>
  <page-container title="租户管理">
    <BaseCrud :form-data="{}" @modal-visible="modalVisible" :model="model" :columns="columns" title="租户列表" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
        </a-space>
      </template>
      <template #name="{ record }">
        <a-avatar shape="square" :size="32" :src="record.tenant.photo"></a-avatar>
        <span style="margin-left: 10px;">{{ record.tenant.name }}</span>
      </template>
      <template #state="{ record }">
        <template v-if="record.tenant.state.value === 'enabled'">
          <a-tag color="#108ee9">{{ record.tenant.state.text }}</a-tag>
        </template>
        <template v-else>
          <a-tag color="#f50">{{ record.tenant.state.text }}</a-tag>
        </template>
      </template>
      <template #createTime="{ record }">
        <span>{{ $moment(record.tenant.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template #action="{ record }">
        <a-space>
          <a>查看</a>
          <template v-if="record.tenant.state.value === 'enabled'">
            <a-popconfirm
              title="确认禁用?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="changeState(record, 'disabled')"
            >
              <a>禁用</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确认启用?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="changeState(record, 'enabled')"
            >
              <a>启用</a>
            </a-popconfirm>
          </template>
        </a-space>
      </template>
    </BaseCrud>
  </page-container>
  <a-modal :width="500" title="新增租户" v-model:visible="visible" cancelText="取消" okText="确认" @ok="okBtn" @cancel="cancelBtn">
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-form-item label="头像" name="photo">
        <FormUpload v-model="form.photo" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="form.username" placeholder="请输入"
        />
      </a-form-item>
      <a-form-item label="新密码" name="password">
        <a-input type="password" v-model:value="form.password" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input type="password" v-model:value="form.confirmPassword" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :rows="4"
          placeholder="请输入"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import FormUpload from '@/components/FormUpload/index.vue'
import BaseService from '@/utils/base-service'
import { createTenant, updateTenant } from './service'
import { message } from 'ant-design-vue'
type State = {
  value: string;
  text: string;
}
export type TenantDetail = {
  id: string;
  name: string;
  type: string;
  state: State;
  members: number;
  photo: string;
  createTime: number;
  description: string;
}

export type TenantItem = {
  members: number;
  tenant: Partial<TenantDetail>;
}

export default defineComponent({
  components: {
    BaseCrud,
    FormUpload
  },
  setup () {
    const service = new BaseService<TenantItem>('tenant/detail')
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        slots: true
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
        key: 'state',
        slots: true
      },
      {
        title: '成员数量',
        align: 'center',
        dataIndex: 'members',
        key: 'members'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        slots: true
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        slots: true
      }
    ]
    const model = ref<'edit' | 'preview' | 'add' | 'refresh'>('preview')
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        id: 'desc'
      }
    }
    const visible = ref<boolean>(false)
    const form = reactive({
      name: '',
      username: '',
      photo: '',
      description: '',
      confirmPassword: '',
      password: ''
    })
    const rules = {
      name: [{ required: true, message: '请输入' }],
      username: [{ required: true, message: '请输入' }],
      confirmPassword: [{ required: true, message: '请输入' }],
      password: [{ required: true, message: '请输入' }]
    }
    const modalVisible = (value: 'edit' | 'preview' | 'add' | 'refresh') => {
      model.value = value
    }
    const addBtn = () => {
      visible.value = true
    }
    const initValue = () => {
      form.name = ''
      form.username = ''
      form.photo = ''
      form.description = ''
      form.confirmPassword = ''
      form.password = ''
    }
    const cancelBtn = () => {
      initValue()
      visible.value = false
    }
    const okBtn = () => {
      model.value = 'preview'
      createTenant(form).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          model.value = 'refresh'
        }
        cancelBtn()
      })
    }
    const changeState = (data: any, state: string) => {
      const params = data.tenant
      params.state = state
      model.value = 'preview'
      updateTenant(params).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          model.value = 'refresh'
        }
      })
    }
    return {
      columns,
      service,
      defaultParams,
      model,
      addBtn,
      modalVisible,
      form,
      visible,
      okBtn,
      cancelBtn,
      rules,
      changeState
    }
  }
})
</script>
