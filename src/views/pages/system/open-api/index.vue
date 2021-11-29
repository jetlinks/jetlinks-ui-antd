<template>
  <page-container title="第三方平台">
    <BaseCrud :form-data="{}" @modal-visible="modalVisible" :model="model" :columns="columns" title="平台列表" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
        </a-space>
      </template>
      <template #status="slotProps">
        <template v-if="slotProps.value.value === 1">
          <a-tag color="#108ee9">{{ slotProps.value.text }}</a-tag>
        </template>
        <template v-else>
          <a-tag color="#f50">{{ slotProps.value.text }}</a-tag>
        </template>
      </template>
      <template #action="{ record }">
        <a-space>
          <a @click="editBtn(record)">编辑</a>
          <a @click="authorizeBtn(record)">赋权</a>
          <template v-if="record.status.value === 1">
            <a-popconfirm
              title="确认禁用?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="delBtn(record.id)"
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
  </page-container>
  <a-modal title="新增" v-model:visible="visible" okText="确定" cancelText="取消" @ok="saveForm" @cancel="cancelForm">
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-form-item label="名称" name="clientName">
        <a-input v-model:value="form.clientName" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="ID" name="clientId">
        <a-input :disabled="true" v-model:value="form.clientId" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="secureKey" name="secureKey">
        <a-input v-model:value="form.secureKey" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="username" name="username">
        <a-input v-model:value="form.username" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="password" name="password">
        <a-input type="password" v-model:value="form.password" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="开启OAuth2" name="enableOAuth2">
        <a-radio-group v-model:value="form.enableOAuth2" button-style="solid">
          <a-radio-button :value="true">开启</a-radio-button>
          <a-radio-button :value="false">关闭</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.enableOAuth2" label="redirectUrl" name="redirectUrl">
        <a-input v-model:value="form.redirectUrl" placeholder="请输入"/>
      </a-form-item>
      <a-form-item label="IP白名单" name="ipWhiteList">
        <a-textarea
          v-model:value="form.ipWhiteList"
          :rows="3"
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :rows="3"
          placeholder="请输入"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <Authorization v-model="authVisible" :data="current" />
</template>

<script lang="ts">
import Authorization from '@/components/Authorization/index.vue'
import { defineComponent, reactive, ref, watch } from 'vue'
import BaseCrud from '@/components/BaseCrud/index.vue'
import BaseService from '@/utils/base-service'
import { uid } from '@/utils/uid'
import { message } from 'ant-design-vue'
export type OpenApiItem = {
  id: string;
  username?: string;
  userId?: string;
  password: string;
  clientName: string;
  createTime: number;
  creatorId: string;
  description: string;
  ipWhiteList: string;
  secureKey: string;
  signature: string;
  enableOAuth2: boolean;
  redirectUrl: string;
  status: number;
};

export default defineComponent({
  components: {
    BaseCrud,
    Authorization
  },
  setup () {
    const service = new BaseService<OpenApiItem>('open-api')
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
        dataIndex: 'clientName',
        key: 'clientName',
        search: true,
        searchParams: {
          transform: (value: string) => ({ clientName$LIKE: value })
        }
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
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
    const authVisible = ref<boolean>(false)
    const current = ref<any>()
    const form = reactive({
      id: '',
      clientName: '',
      clientId: uid(16),
      secureKey: uid(24),
      username: '',
      password: '',
      enableOAuth2: false,
      ipWhiteList: '',
      description: '',
      redirectUrl: ''
    })
    const rules = {
      clientId: [{ required: true, message: '请输入' }],
      clientName: [{ required: true, message: '请输入' }],
      secureKey: [{ required: true, message: '请输入' }],
      username: [{ required: true, message: '请输入' }]
    }
    const model = ref<'edit' | 'preview' | 'add' | 'refresh'>('preview')
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10
    }
    const schema = {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          title: '输入框',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input'
        }
      }
    }
    const modalVisible = (value: 'edit' | 'preview' | 'add' | 'refresh') => {
      model.value = value
    }
    const addBtn = () => {
      form.id = ''
      form.clientName = ''
      form.clientId = uid(16)
      form.secureKey = uid(24)
      form.username = ''
      form.password = ''
      form.enableOAuth2 = false
      form.ipWhiteList = ''
      form.description = ''
      form.redirectUrl = ''
      visible.value = true
    }
    const editBtn = (data: OpenApiItem) => {
      Object.assign(form, data)
      visible.value = true
    }
    const delBtn = (id: string) => {
      model.value = 'preview'
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    watch(() => visible, (newValue) => {
      if (newValue) {
        form.clientId = uid(16)
        form.secureKey = uid(24)
      }
    })
    const cancelForm = () => {
      visible.value = false
    }
    const updateData = (data: any) => {
      model.value = 'preview'
      service.update(data).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功')
          model.value = 'refresh'
        }
      })
    }
    const saveForm = () => {
      const data = {
        clientName: form.clientName,
        description: form.description,
        enableOAuth2: form.enableOAuth2,
        id: form.id,
        ipWhiteList: form.ipWhiteList,
        redirectUrl: form.redirectUrl,
        secureKey: form.secureKey,
        signature: 'MD5',
        username: form.username
      }
      updateData({ ...data })
      visible.value = false
    }
    const enableOrDisable = (record: any) => {
      updateData({
        id: record.id,
        status: record.status?.value === 1 ? 0 : 1
      })
    }
    const authorizeBtn = (data: OpenApiItem) => {
      authVisible.value = true
      current.value = {
        id: data.id,
        name: data.clientName,
        targetType: 'open-api'
      }
    }
    return {
      visible,
      columns,
      service,
      defaultParams,
      model,
      form,
      schema,
      addBtn,
      editBtn,
      delBtn,
      modalVisible,
      saveForm,
      cancelForm,
      authVisible,
      current,
      rules,
      enableOrDisable,
      authorizeBtn
    }
  }
})
</script>
