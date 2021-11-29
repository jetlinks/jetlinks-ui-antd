<template>
  <page-container title="产品详情">
    <template #content>
      <a-descriptions title="基本信息">
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
    </template>
    <a-card>
      产品详情
    </a-card>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { getProductDetail, getDeviceCount } from '@/views/pages/device/product/service'
import encodeQuery from '@/utils/encodeQuery'
export default defineComponent({
  props: ['id'],
  setup (props) {
    const id = props.id || ''
    const basicInfo = reactive<any>({
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
      transportProtocol: ''
    })
    onMounted(() => {
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
        }
      })
    })
    return {
      basicInfo
    }
  }
})
</script>
