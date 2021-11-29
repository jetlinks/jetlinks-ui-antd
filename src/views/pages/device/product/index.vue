<template>
  <page-container title="产品管理">
    <a-card style="margin-bottom: 20px;">
      <SearchForm :columns="searchList" @onSearch="onSearch" />
      <a-space style="margin-top: 20px;">
        <a-button type="primary" @click="addBtn">新增产品</a-button>
        <a-button><ImportOutlined />快速导入</a-button>
      </a-space>
    </a-card>
    <a-spin :spinning="spinning">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="6" v-for="item in dataSource.data" :key="item.id">
          <a-card hoverable style=" margin: 0 10px 20px 0;">
            <a-card-meta :title="item.name" :description="item.id">
              <template #avatar>
                <a-avatar :src="item.photoUrl ? item.photoUrl : photoUrl" />
              </template>
            </a-card-meta>
            <div style="display: flex; justify-content: space-around;margin-top: 15px;">
              <div style="text-align: center">
                <div style="color: rgba(0, 0, 0, 0.45);">设备数量</div>
                <div><a>{{ deviceCount[item.id] }}</a></div>
              </div>
              <div style="text-align: center">
                <div style="color: rgba(0, 0, 0, 0.45);">发布状态</div>
                <div>
                  <template v-if="item.state === 1">
                    <a-badge status="success" />已发布
                  </template>
                  <template v-else>
                    <a-badge status="error" />未发布
                  </template>
                </div>
              </div>
              <div style="text-align: center">
                <div style="color: rgba(0, 0, 0, 0.45);">产品类型</div>
                <div>{{ item.deviceType.text }}</div>
              </div>
            </div>
            <template class="ant-card-actions" #actions>
              <EyeOutlined @click="getDetail(item.id)" />
              <EditOutlined @click="editBtn(item)" />
              <DownloadOutlined @click="download(item, '产品')" />
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  <EllipsisOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="item.state !== 0">
                      <a-popconfirm
                        title="确认停用?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="unDeploy(item)"
                      >
                        <a style="display: flex; align-items: center; justify-content: space-around;"><CloseOutlined style="margin-right: 10px" />停用</a>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item v-else>
                      <a-popconfirm
                        title="确认发布?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="deploy(item)"
                      >
                        <a style="display: flex; align-items: center; justify-content: space-around;"><CheckOutlined style="margin-right: 10px" />发布</a>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                        title="确认删除?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="delBtn(item)"
                      >
                        <a style="display: flex; align-items: center; justify-content: space-around;"><StopOutlined style="margin-right: 10px" />删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-card>
        </a-col>
      </a-row>
      <div v-if="dataSource.total > 0" style="display: flex; justify-content: flex-end;">
        <a-pagination
          @change="onPageChange"
          :total="dataSource.total"
          :show-total="total => `共 ${total} 条记录`"
          :page-size="dataSource.pageSize"
          :current="dataSource.pageIndex + 1"
        />
      </div>
    </a-spin>
  </page-container>
  <Save v-model="visible" :data="current" @ok-btn="okBtn" />
</template>

<script lang="ts">
import { CloseOutlined, EyeOutlined, EditOutlined, DownloadOutlined, EllipsisOutlined, ImportOutlined, CheckOutlined, StopOutlined } from '@ant-design/icons-vue'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import SearchForm from '@/components/SearchForm/index.vue'
import BaseService from '@/utils/base-service'
import { getCategory, getDeviceCount, setDeploy, setUnDeploy } from '@/views/pages/device/product/service'
import encodeQuery from '@/utils/encodeQuery'
import Save from './save/index.vue'
import { message } from 'ant-design-vue'
import { downloadObject, getView } from '@/utils/utils'
import router from '@/router'

export type ProductItem = {
  id: string;
  name: string;
  classifiedId: string;
  classifiedName: string;
  configuration: Record<string, any>;
  createTime: number;
  creatorId: string;
  photoUrl?: string;
  deviceType: {
    text: string;
    value: string;
  };
  count?: number;
  messageProtocol: string;
  metadata: string;
  orgId: string;
  protocolName: string;
  state: number;
  transportProtocol: string;
};
type DataSourceType = {
  pageSize: number;
  pageIndex: number,
  total: number;
  data: ProductItem[]
}
export const service = new BaseService<ProductItem>('device-product')
export default defineComponent({
  components: {
    Save, SearchForm, EyeOutlined, EditOutlined, DownloadOutlined, EllipsisOutlined, ImportOutlined, CloseOutlined, CheckOutlined, StopOutlined
  },
  setup () {
    const photoUrl = 'https://demo.jetlinks.cn/static/product.1bd0a3b1.png'
    const categoryList = reactive<any[]>([])
    const searchList = reactive([
      {
        type: 'string',
        label: '名称',
        value: '',
        key: 'name',
        transform: (value: string) => ({ name$LIKE: value })
      },
      {
        type: 'tree-select',
        label: '分类',
        value: '',
        enum: categoryList,
        key: 'classifiedId'
      }
    ])
    const deviceCount = reactive<any>({})
    const spinning = ref<boolean>(false)
    const dataSource = reactive<DataSourceType>({
      pageSize: 0,
      pageIndex: 0,
      total: 0,
      data: []
    })
    const visible = ref<boolean>(false)
    const current = reactive<any>({
      id: '',
      name: '',
      classifiedId: '',
      classifiedName: '',
      photoUrl: 'https://demo.jetlinks.cn/static/product.1bd0a3b1.png',
      deviceType: '',
      messageProtocol: '',
      orgId: '',
      protocolName: '',
      storePolicy: '',
      transportProtocol: '',
      describe: ''
    })
    const handleSearch = (params: any) => {
      spinning.value = true
      service.query(encodeQuery(params)).then(resp => {
        if (resp.data.status === 200) {
          Object.assign(dataSource, resp.data.result)
        }
        spinning.value = false
      })
    }
    onMounted(() => { // 产品分类
      getCategory({ paging: false }).then(resp => {
        const list: any[] = resp.data.result.map((i: any) => {
          return { ...getView(i) }
        })
        searchList[1].enum = list
      })
      handleSearch({
        pageSize: 8,
        pageIndex: 0,
        sorts: {
          id: 'desc'
        }
      })
    })
    watch(dataSource, (newValue) => {
      newValue.data.map(item => {
        getDeviceCount(encodeQuery({
          terms: {
            productId: item.id
          }
        })).then(resp => {
          if (resp.data.status === 200) {
            deviceCount[item.id] = resp.data.result
          }
        })
      })
    }, {
      deep: true
    })
    const onPageChange = (page: number, pageSize: number) => {
      handleSearch({
        pageSize: pageSize,
        pageIndex: page - 1,
        sorts: {
          id: 'desc'
        }
      })
    }
    const onSearch = (params: any) => {
      handleSearch({
        pageSize: 8,
        pageIndex: 0,
        terms: {
          ...params
        },
        sorts: {
          id: 'desc'
        }
      })
    }
    const addBtn = () => {
      current.id = ''
      current.name = ''
      current.classifiedId = ''
      current.classifiedName = ''
      current.photoUrl = 'https://demo.jetlinks.cn/static/product.1bd0a3b1.png'
      current.deviceType = ''
      current.messageProtocol = ''
      current.orgId = ''
      current.protocolName = ''
      current.storePolicy = ''
      current.transportProtocol = ''
      current.describe = ''
      current.state = 0
      current.configuration = undefined
      current.createTime = undefined
      current.creatorId = ''
      current.metadata = ''
      visible.value = true
    }
    const editBtn = (data: ProductItem) => {
      Object.assign(current, {
        ...data,
        deviceType: data.deviceType.value
      })
      visible.value = true
    }
    const okBtn = (data: any) => {
      if (current.id && current.id !== '') {
        service.update(data).then(resp => {
          if (resp.data.status === 200) {
            handleSearch({
              pageSize: 8,
              pageIndex: 0,
              sorts: {
                id: 'desc'
              }
            })
          }
        })
      } else {
        service.save(data).then(resp => {
          if (resp.data.status === 200) {
            handleSearch({
              pageSize: 8,
              pageIndex: 0,
              sorts: {
                id: 'desc'
              }
            })
          }
        })
      }
    }
    const delBtn = (data: any) => {
      if (data.state === 0 && deviceCount[data.id] === 0) {
        service.remove(data.id).then(resp => {
          if (resp.data.status === 200) {
            message.success('操作成功！')
            handleSearch({
              pageSize: 8,
              pageIndex: 0,
              sorts: {
                id: 'desc'
              }
            })
          }
        })
      } else {
        message.error('产品以发布，无法删除')
      }
    }
    const deploy = (data: any) => {
      setDeploy(data.id).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          handleSearch({
            pageSize: 8,
            pageIndex: 0,
            sorts: {
              id: 'desc'
            }
          })
        }
      })
    }
    const unDeploy = (data: any) => {
      setUnDeploy(data.id).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          handleSearch({
            pageSize: 8,
            pageIndex: 0,
            sorts: {
              id: 'desc'
            }
          })
        }
      })
    }
    const download = (data: any, title: string) => {
      downloadObject(data, title)
    }
    const getDetail = (id: string) => {
      router.push({
        path: 'product/' + id
      })
    }
    return {
      spinning,
      photoUrl,
      searchList,
      dataSource,
      deviceCount,
      onPageChange,
      onSearch,
      visible,
      addBtn,
      editBtn,
      current,
      okBtn,
      delBtn,
      deploy,
      unDeploy,
      download,
      getDetail
    }
  }
})
</script>
