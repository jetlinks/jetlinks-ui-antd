<template>
  <a-card>
    <a-tabs tab-position="left">
      <a-tab-pane key="1" tab="系统配置">
        <a-card title="系统配置" :bordered="false">
          <a-form layout="vertical" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="系统名称">
              <a-input v-model:value="formState.title" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="主题色">
              <a-select v-model:value="formState.navTheme" placeholder="请选择">
                <a-select-option value="light">light</a-select-option>
                <a-select-option value="dark">dark</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="主题色">
              <FormUpload v-model="formState.titleIcon" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onSubmit">更新基本信息</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRaw, UnwrapRef } from 'vue'
import { getFrontConfig, updateFrontConfig } from '@/apis/layout'
import FormUpload from '@/components/FormUpload/index.vue'
import { layoutState } from '@/layouts/layout'
import { message } from 'ant-design-vue'

interface FormState {
  title: string;
  navTheme: string;
  titleIcon: string;
}
export default defineComponent({
  components: { FormUpload },
  setup () {
    const formState: UnwrapRef<FormState> = reactive({
      title: layoutState.title,
      navTheme: layoutState.navTheme,
      titleIcon: layoutState.titleIcon
    })
    onMounted(() => {
      layoutState.get()
    })
    const onSubmit = () => {
      layoutState.update({ ...toRaw(formState) })
    }
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formState,
      onSubmit
    }
  }
})
</script>
