<template>
  <a-drawer title="新增产品" v-model:visible="modalVisible" @close="closeBtn" :width="450">
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-form-item label="图标" name="photoUrl">
        <FormUpload v-model="form.photoUrl" />
      </a-form-item>
      <a-form-item label="产品ID" name="id">
        <a-input v-model:value="form.id" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="产品名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入"
        />
      </a-form-item>
      <a-form-item label="所属品类" name="classifiedId">
        <a-tree-select
          :treeDefaultExpandedKeys="[form.classifiedId]"
          v-model:value="form.classifiedId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="categoryList"
          placeholder="请选择"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="所属机构" name="orgId">
        <a-tree-select
          v-model:value="form.orgId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="orgList"
          placeholder="请选择"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="消息协议" name="messageProtocol">
        <a-select placeholder="请选择" v-model:value="form.messageProtocol">
          <template v-for="item in messageProtocolList" :key="item.id">
            <a-select-option :value="item.id">{{ item.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="传输协议" name="transportProtocol">
        <a-select placeholder="请选择" v-model:value="form.transportProtocol">
          <template v-for="item in transportsList" :key="item.id">
            <a-select-option :value="item.id">{{ item.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="存储策略" name="storePolicy">
        <a-select placeholder="请选择" v-model:value="form.storePolicy">
          <template v-for="item in storageList" :key="item.id">
            <a-select-option  :value="item.id">{{ item.name }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="设备类型" name="deviceType">
        <a-radio-group v-model:value="form.deviceType">
          <a-radio value="device">直连设备</a-radio>
          <a-radio value="childrenDevice">网关子设备</a-radio>
          <a-radio value="gateway">网关设备</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="描述" name="describe">
        <a-textarea
          v-model:value="form.describe"
          :rows="4"
          placeholder="请输入"
        />
      </a-form-item>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="closeBtn">取消</a-button>
      <a-button type="primary" @click="okBtn">确定</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, reactive, watch, toRefs, toRaw } from 'vue'
import { getStorageList, getMessageProtocolList, getTransportsList, getOrgList, getCategory, getDefaultModel } from '../service'
import encodeQuery from '@/utils/encodeQuery'
import FormUpload from '@/components/FormUpload/index.vue'
import { getView } from '@/utils/utils'
export default defineComponent({
  name: 'Save',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue', 'ok-btn'],
  components: { FormUpload },
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(false)
    const storageList = reactive<any[]>([])
    const messageProtocolList = reactive<any[]>([])
    const transportsList = reactive<any[]>([])
    const orgList = reactive<any[]>([])
    const defaultMetadata = ref<string>(props.data.metadata || '{"events":[],"properties":[],"functions":[],"tags":[]}')
    const categoryList = reactive<any[]>([])
    const form = reactive({
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
    const rules = {
      id: [{ required: true, message: '请输入' }],
      name: [{ required: true, message: '请输入' }],
      classifiedId: [{ required: true, message: '请输入' }],
      messageProtocol: [{ required: true, message: '请选择' }],
      transportProtocol: [{ required: true, message: '请选择' }],
      deviceType: [{ required: true, message: '请选择' }]
    }
    const getDefaultMetadata = (id: string, transport: string) => {
      getDefaultModel(id, transport).then(resp => {
        if (resp.data.status === 200) {
          if (resp.data.result === '{}') {
            defaultMetadata.value = '{"events":[],"properties":[],"functions":[],"tags":[]}'
          } else {
            defaultMetadata.value = resp.data.result
          }
        } else {
          defaultMetadata.value = '{"events":[],"properties":[],"functions":[],"tags":[]}'
        }
      })
    }
    watchEffect(() => {
      Object.assign(form, props.data)
    })
    watch(() => props.modelValue, (newValue) => {
      modalVisible.value = newValue
      if (newValue) {
        // 机构
        getOrgList(encodeQuery({
          paging: false,
          terms: {
            typeId: 'org'
          }
        })).then(resp => {
          if (resp.data.status === 200) {
            const list = resp.data.result.map((i: any) => {
              return { ...getView(i) }
            })
            Object.assign(orgList, list)
          }
        })
        // 存储策略
        getStorageList().then(resp => {
          if (resp.data.status === 200) {
            Object.assign(storageList, resp.data.result)
          }
        })
        // 消息协议
        getMessageProtocolList().then(resp => {
          if (resp.data.status === 200) {
            Object.assign(messageProtocolList, resp.data.result)
          }
        })
        // 产品分类
        getCategory({ paging: false }).then(resp => {
          const list = resp.data.result.map((i: any) => {
            return { ...getView(i) }
          })
          Object.assign(categoryList, list)
        })
      }
    })
    watch(() => form.messageProtocol, (newValue) => {
      if (newValue) { // 传输协议
        getTransportsList(newValue).then(resp => {
          if (resp.data.status === 200) {
            Object.assign(transportsList, resp.data.result)
            if (newValue === props.data.messageProtocol) {
              form.transportProtocol = props.data.transportProtocol
            } else {
              form.transportProtocol = ''
            }
          }
        })
      }
    })
    watch(() => form.transportProtocol, (newValue) => {
      if (newValue !== '' && form.messageProtocol !== '' && props.data.id !== '') {
        getDefaultMetadata(form.messageProtocol, newValue)
      }
    })
    const okBtn = () => {
      const protocol = messageProtocolList.find(item => form.messageProtocol === item.id)
      const classified = categoryList.find(item => form.classifiedId === item.value)
      const data = {
        ...toRaw(form),
        metadata: defaultMetadata.value,
        protocolName: protocol.name,
        classifiedName: classified.title
      }
      emit('ok-btn', data)
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const closeBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    return {
      form,
      rules,
      modalVisible,
      okBtn,
      storageList,
      messageProtocolList,
      transportsList,
      orgList,
      categoryList,
      closeBtn
    }
  }
})
</script>
