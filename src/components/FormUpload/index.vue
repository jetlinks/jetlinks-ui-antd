<template>
  <div style="display: flex; flex-direction: column;">
    <template v-if="modelValue && modelValue !== ''">
      <img style="width: 120px; margin-bottom: 10px;" :src="modelValue" alt="avatar" />
    </template>
    <template v-else>
      <a-avatar style="margin-bottom: 10px;" shape="square" :size="120">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </template>
    <a-upload
      name="file"
      action='http://demo.jetlinks.cn/jetlinks/file/static'
      :headers="headers"
      :showUploadList="false"
      method="post"
      :multiple="false"
      @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        更换图片
      </a-button>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { headers } from '@/utils/utils'
import { UserOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'FormUpload',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: { UserOutlined },
  setup (props, { emit }) {
    const handleChange = (info: any) => {
      if (info.file.status !== 'uploading') {
        emit('update:modelValue', info.file.response.result || '')
      }
    }
    return {
      headers,
      handleChange
    }
  }
})
</script>
