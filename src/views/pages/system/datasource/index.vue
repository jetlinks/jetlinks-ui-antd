<template>
  <page-container title="数据源管理">
    <BaseCrud :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="数据源列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
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
import { message } from 'ant-design-vue'
type DataSourceItem = {
  id: string;
  name: string;
  shareCluster: true;
  shareConfig: Record<string, any>;
  state: {
    text: string;
    value: string;
  };
  typeId: string;
  createTime: number;
  creatorId: string;
  creatorName: string;
  description: string;
};

type DataSourceType = {
  label: string;
  value: string;
  id: string;
  name: string;
};

export default defineComponent({
  components: {
    BaseCrud
  },
  setup () {
    const service = new BaseService<DataSourceItem>('datasource/config')
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
        title: '类型',
        dataIndex: 'typeId',
        key: 'typeId'
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: '状态',
        slots: true,
        dataIndex: 'state',
        key: 'state'
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
            placeholder: '请输入'
            // disabled: (model.value === 'edit')
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
    const modalChange = (params: any) => {
      service.update(params).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const addBtn = () => {
      message.info('开发中')
      // formData.id = ''
      // formData.name = ''
      // formData.username = ''
      // formData.password = ''
      // formData.confirmPassword = ''
      // model.value = 'add'
    }
    const editBtn = (data: any) => {
      message.info('开发中')
      // formData.id = data.id
      // formData.name = data.name
      // formData.username = data.username
      // formData.password = '******'
      // formData.confirmPassword = '******'
      // model.value = 'edit'
    }
    const delBtn = (id: string) => {
      message.info('开发中')
      // service.remove(id).then(res => {
      //   if (res.data.status === 200) {
      //     model.value = 'refresh'
      //   }
      // })
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
      modalChange
    }
  }
})
</script>
