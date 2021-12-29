<template>
  <page-container title="设备管理">
    <BaseCrud :form-data="formData" @modal-change="modalChange" @modal-visible="modalVisible" :model="model" :columns="columns" title="设备列表" :formPar="FormPar" :service="service" :default-params="defaultParams">
      <template #extra>
        <a-space>
          <a-button @click="addBtn" type="primary">新增</a-button>
        </a-space>
      </template>
      <template #registryTime="slotProps">
        <span>{{ $moment(slotProps.value).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template #state="slotProps">
        <template v-if="slotProps.value.value === 'notActive'">
          <a-tag color="#f50">{{ slotProps.value.text }}</a-tag>
        </template>
        <template v-else>
          <a-tag color="#108ee9">{{ slotProps.value.text }}</a-tag>
        </template>
      </template>
      <template #action="{ record }">
        <a-space>
          <a>查看</a>
          <a @click="editBtn(record)">编辑</a>
          <template v-if="record.state.value !== 'notActive'">
            <a-popconfirm
              title="确认禁用?"
              ok-text="确认"
              cancel-text="取消"
            >
              <a>禁用</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确认启用?"
              ok-text="确认"
              cancel-text="取消"
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
import { getOrganizationList, getAllProductList } from '@/views/pages/device/instance/service'
export interface DeviceItem {
  id: string | undefined;
  name: string;
  describe?: string;
  description?: string;
  productId: string;
  productName: string;
  protocolName?: string;
  security?: any;
  deriveMetadata?: string;
  metadata?: string;
  binds?: any;
  state?: {
    value: string;
    text: string;
  };
  creatorId?: string;
  creatorName?: string;
  createTime?: number;
  registryTime?: string;
  disabled?: boolean;
  aloneConfiguration?: boolean;
  deviceType?: {
    value: string;
    text: string;
  };
  transportProtocol?: string;
  messageProtocol?: string;
  orgId?: string;
  orgName?: string;
  configuration?: Record<string, any>;
  cachedConfiguration?: any;
  transport?: string;
  protocol?: string;
  address?: string;
  registerTime?: number;
  onlineTime?: string | number;
  tags?: any;
}

export default defineComponent({
  components: {
    BaseCrud,
    Authorization
  },
  setup () {
    const service = new BaseService<DeviceItem>('device-instance')
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
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        search: true,
        searchParams: {
          transform: (value: string) => ({ name$LIKE: value })
        }
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        slots: true
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
          name: 'id',
          rules: {
            trigger: 'blur',
            message: '请输入',
            required: true
          },
          label: '设备ID',
          formItemOptions: {
            type: 'input'
          }
        },
        {
          name: 'name',
          rules: {
            trigger: 'blur',
            message: '请输入',
            required: true
          },
          label: '设备名称',
          formItemOptions: {
            type: 'input'
          }
        },
        {
          formItemOptions: {
            type: 'select',
            placeholder: '请选择',
            enum: []
          },
          rules: {
            required: true,
            message: '请输入'
          },
          name: 'productId',
          label: '产品'
        },
        {
          formItemOptions: {
            type: 'select',
            placeholder: '请选择',
            enum: []
          },
          name: 'orgId',
          label: '所属机构'
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
    const productList = ref<any[]>([])
    const formData = reactive({
      id: '',
      name: '',
      productId: '',
      productName: '',
      orgId: '',
      describe: ''
    })
    const defaultParams = {
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        id: 'desc'
      }
    }
    const initData = () => {
      getOrganizationList().then(resp => {
        if (resp.data.status === 200) {
          const list = resp.data.result.map((item: any) => {
            return {
              label: item.name,
              value: item.id
            }
          })
          FormPar.formItems[2].formItemOptions.enum = list
        }
      })
      getAllProductList().then(resp => {
        if (resp.data.status === 200) {
          productList.value = resp.data.result
          const list = resp.data.result.map((item: any) => {
            return {
              label: item.name,
              value: item.id
            }
          })
          FormPar.formItems[3].formItemOptions.enum = list
        }
      })
    }
    const modalVisible = (value: 'edit' | 'preview' | 'add' | 'refresh') => {
      model.value = value
    }
    const visible = ref<boolean>(false)
    const current = ref()
    const modalChange = (param: any) => {
      model.value = 'preview'
      const product = productList.value.find(item => item.id === param.productId) || {}
      const data: DeviceItem = {
        ...param,
        productName: product.name || ''
      }
      service.update(data).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    const addBtn = () => {
      initData()
      FormPar.formItems[0].formItemOptions.disabled = false
      FormPar.formItems[2].formItemOptions.disabled = false
      formData.id = ''
      formData.name = ''
      formData.productId = ''
      formData.productName = ''
      formData.orgId = ''
      formData.describe = ''
      model.value = 'add'
    }
    const editBtn = (data: DeviceItem) => {
      initData()
      FormPar.formItems[0].formItemOptions.disabled = true
      FormPar.formItems[2].formItemOptions.disabled = true
      formData.id = data.id || ''
      formData.name = data.name
      formData.productId = data.productId
      formData.productName = data.productName
      formData.orgId = data.orgId || ''
      formData.describe = data.describe || ''
      model.value = 'edit'
    }
    const delBtn = (id: string) => {
      service.remove(id).then(res => {
        if (res.data.status === 200) {
          model.value = 'refresh'
        }
      })
    }
    // const enableOrDisable = (data: any) => {
    //   model.value = 'preview'
    //   // service.update({ id: data.id, status: data.status === 1 ? 0 : 1 }).then(resp => {
    //   //   if (resp.data.status === 200) {
    //   //     message.success('操作成功！')
    //   //     model.value = 'refresh'
    //   //   }
    //   // })
    // }
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
      // enableOrDisable,
      visible,
      current
    }
  }
})
</script>
