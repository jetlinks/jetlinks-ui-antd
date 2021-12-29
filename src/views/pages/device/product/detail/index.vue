<template>
  <page-container :title="basicInfo.name">
    <template #content>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          产品状态：<a-badge :color="basicInfo.state === 1 ? 'green' : 'red'" :text="basicInfo.state === 1 ? '已发布' : '未发布'"></a-badge>
          <template v-if="basicInfo.state === 1">
            <a-popconfirm title="确认停用？">
              <a style="margin-left: 20px">停用</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a style="margin-left: 20px">发布</a>
          </template>
        </div>
        <a-button type="primary"><SyncOutlined />应用配置</a-button>
      </div>
    </template>
    <a-card>
      <a-tabs tab-position="left">
        <a-tab-pane key="1" tab="产品信息">
          <a-descriptions bordered title="基本信息">
            <template #extra>
              <a-button type="primary" ghost @click="editBtn"><EditOutlined />编辑</a-button>
            </template>
            <a-descriptions-item label="产品ID">{{ basicInfo.id }}</a-descriptions-item>
            <a-descriptions-item label="产品名称">{{ basicInfo.name }}</a-descriptions-item>
            <a-descriptions-item label="所属品类">{{ basicInfo.classifiedName }}</a-descriptions-item>
            <a-descriptions-item label="消息协议">{{ basicInfo.messageProtocol }}</a-descriptions-item>
            <a-descriptions-item label="链接协议">{{ basicInfo.transportProtocol }}</a-descriptions-item>
            <a-descriptions-item label="设备类型">{{ basicInfo.deviceType.text }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ $moment(basicInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}</a-descriptions-item>
            <a-descriptions-item label="设备数量">
              <a>{{ basicInfo.count }}</a>
            </a-descriptions-item>
          </a-descriptions>
          <template v-if="(config || []).length > 0">
            <div style="margin-top: 20px">
              <div style="display: flex; justify-content: space-between;">
                <h3>配置</h3>
                <a-button @click="editConfig" type="primary" ghost><EditOutlined />编辑</a-button>
              </div>
              <template v-for="item in config" :key="item.name">
                <h3>{{ item.name }}</h3>
                <template v-if="item.properties">
                  <a-descriptions bordered :column="2">
                    <template v-for="i in item.properties" :key="i.property">
                      <a-descriptions-item :span="1">
                        <template #label>
                          {{ i.name }}<a-tooltip v-if="i.description" :title="i.description"><QuestionCircleOutlined /></a-tooltip>
                        </template>
                        <template v-if="basicInfo.configuration">
                          {{ i.type && i.type.type === 'password' && (basicInfo.configuration[i.property] || '').length > 0 ? '******' : basicInfo.configuration[i.property] }}
                        </template>
                      </a-descriptions-item>
                    </template>
                  </a-descriptions>
                </template>
              </template>
            </div>
          </template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="物模型">
          <Definition />
        </a-tab-pane>
        <a-tab-pane key="3" tab="告警设置">
          <Alarm :target="'product'" :targetId="id" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <Save v-model="visible" :data="basicInfo" @ok-btn="okBtn" />
  </page-container>
  <Configuration @ok-btn="saveConfig" v-model="updateVisible" :data="basicInfo" :configuration="config" />
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, provide } from 'vue'
import { getProductDetail, getDeviceCount, productConfiguration, updateProduct, setUnDeploy } from '@/views/pages/device/product/service'
import encodeQuery from '@/utils/encodeQuery'
import { service } from '@/views/pages/device/product/index.vue'
import Save from '../save/index.vue'
import Definition from './definition/index.vue'
import Alarm from '../../alarm/index.vue'
import Configuration from './configuration/index.vue'
import { message } from 'ant-design-vue'
export type ProductItem = {
  id: string;
  name: string;
  classifiedId: string;
  classifiedName: string;
  configuration?: Record<string, any>;
  createTime?: number;
  creatorId?: string;
  deviceType: {
    text: string;
    value: string;
  };
  photoUrl?: string;
  count?: number;
  messageProtocol: string;
  metadata: string;
  orgId: string;
  protocolName: string;
  state?: number;
  transportProtocol: string;
}
export default defineComponent({
  props: ['id'],
  components: { Save, Definition, Alarm, Configuration },
  setup (props) {
    const id = props.id || ''
    const visible = ref<boolean>(false)
    const updateVisible = ref<boolean>(false)
    const basicInfo = reactive<ProductItem>({
      id: '',
      name: '',
      classifiedId: '',
      classifiedName: '',
      photoUrl: 'https://demo.jetlinks.cn/static/product.1bd0a3b1.png',
      deviceType: {
        text: '',
        value: ''
      },
      messageProtocol: '',
      orgId: '',
      protocolName: '',
      transportProtocol: '',
      metadata: '{"events":[],"properties":[],"functions":[],"tags":[]}'
    })
    provide('basicInfo', basicInfo)
    const config = ref<any>()
    const getBasicInfo = () => {
      getProductDetail(id).then(resp => {
        if (resp.data.status === 200) {
          Object.assign(basicInfo, resp.data.result)
          getDeviceCount(encodeQuery({
            terms: {
              productId: resp.data.result.id
            }
          })).then(resp => {
            if (resp.data.status === 200) {
              basicInfo.count = resp.data.result
            }
          })
          productConfiguration(resp.data.result.id).then(resp => {
            if (resp.data.status === 200) {
              config.value = resp.data.result
            }
          })
        }
      })
    }
    onMounted(() => {
      getBasicInfo()
    })
    const editBtn = () => {
      visible.value = true
    }
    const okBtn = (data: any) => {
      service.update(data).then(resp => {
        if (resp.data.status === 200) {
          getBasicInfo()
        }
        visible.value = false
      })
    }
    const editConfig = () => {
      updateVisible.value = true
    }
    const saveConfig = (data: any) => {
      const params = { configuration: { ...data.configuration } }
      updateProduct(id, params).then(resp => {
        if (resp.data.status === 200) {
          if (!data.onlySave) {
            setUnDeploy(id || '').then(res => {
              if (res.data.status === 200) {
                message.success('操作成功')
                getBasicInfo()
              }
            })
          } else {
            getBasicInfo()
          }
        }
        updateVisible.value = false
      })
    }
    return {
      visible,
      basicInfo,
      editBtn,
      okBtn,
      config,
      updateVisible,
      editConfig,
      saveConfig
    }
  }
})
</script>
