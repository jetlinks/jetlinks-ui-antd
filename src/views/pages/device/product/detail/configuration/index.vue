<template>
  <a-drawer title="编辑配置" v-model:visible="modalVisible" @close="closeBtn" :width="450">
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row :gutter="24">
        <template v-for="item in configForm" :key="item.name">
          <a-col :span="24">
            <h4>{{item.name}}</h4>
            <a-col v-for="i in item.properties" :key="i.name">
              <a-form-item :name="i.property">
                <template #label>{{i.name}}<a-tooltip v-if="i.description" :title="i.description"><QuestionCircleOutlined /></a-tooltip></template>
                <template v-if="i.type.id !== 'enum'">
                  <template v-if="i.type && i.type.type === 'password'">
                    <a-input-password v-model:value="form[i.property]" />
                  </template>
                  <template v-else>
                    <a-input v-model:value="form[i.property]" />
                  </template>
                </template>
                <template v-else>
                  <a-select v-model:value="form[i.property]">
                    <template v-for="j in i.type.elements" :key="j.value">
                      <a-select-option :value="j.value">{{j.text}}</a-select-option>
                    </template>
                  </a-select>
                </template>
              </a-form-item>
            </a-col>
          </a-col>
        </template>
      </a-row>
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
      <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1" @click="okBtn(true)">仅保存</a-menu-item>
          <a-menu-item key="2" @click="okBtn(false)">保存并生效</a-menu-item>
        </a-menu>
      </template>
      <a-button type="primary">保存</a-button>
    </a-dropdown>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, reactive, toRaw } from 'vue'
export default defineComponent({
  name: 'Configuration',
  props: ['modelValue', 'data', 'configuration'],
  emits: ['update:modelValue', 'ok-btn'],
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(props.modelValue)
    const form = reactive<any>({})
    const configForm = ref<any[]>([])
    watchEffect(() => {
      modalVisible.value = props.modelValue
      configForm.value = props.configuration
      if (props.configuration) {
        props.configuration.forEach((item: any) => {
          if (item.properties) {
            item.properties.forEach((i: any) => {
              form[i.property] = props.data.configuration && props.data.configuration[i.property] ? props.data.configuration[i.property] : undefined
            })
          }
        })
      }
    })
    const okBtn = (onlySave: boolean) => {
      modalVisible.value = false
      emit('update:modelValue', false)
      emit('ok-btn', { onlySave, configuration: { ...toRaw(form) } })
    }
    const closeBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }

    return {
      form,
      modalVisible,
      okBtn,
      closeBtn,
      configForm,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
  }
})
</script>
