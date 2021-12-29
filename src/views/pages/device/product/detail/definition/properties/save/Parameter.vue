<template>
  <a-drawer title="新增" v-model:visible="modalVisible" @close="okBtn" :width="500">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="属性标识" name="id">
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item label="属性名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="数据类型" :name="['valueType', 'type']">
        <a-select v-model:value="formState.valueType.type" placeholder="请选择">
          <template v-for="item in DataTypeList" :key="item.value">
            <a-select-option :value="item.value">{{ item.label }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
    </a-form>
    <div :style="{
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #e9e9e9',
      padding: '10px 16px',
      background: '#fff',
      textAlign: 'right',
      zIndex: 1,
    }">
      <a-button style="margin-right: 8px" @click="okBtn">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch, UnwrapRef, reactive } from 'vue'
import { DataTypeList, PropertySource, DateTypeList, FileTypeList } from '../../data'
interface FormState {
  id: undefined | string;
  name: undefined | string;
  valueType: {
    type: string;
    scale?: number;
    unit?: string;
    trueText?:string;
    trueValue?:string | boolean;
    falseText?:string;
    falseValue?:string | boolean;
    format?: string;
    fileType?: string;
    elements: any[];
    expands: {
      maxLength?: string;
    },
    elementType: {
      type?: string;
      scale?: number;
      unit?: string;
      trueText?:string;
      trueValue?:string | boolean;
      falseText?:string;
      falseValue?:string | boolean;
      format?: string;
      fileType?: string;
      elements: any[];
      expands: {
        maxLength?: string;
      }
    }
  },
  expands: {
    readOnly: string;
    source?: string;
  },
  description: string;
}
export default defineComponent({
  name: 'Parameter',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const modalVisible = ref<boolean>(false)
    const formRef = ref()
    const formState: UnwrapRef<FormState> = reactive({
      id: undefined,
      name: undefined,
      valueType: {
        type: '',
        expands: {},
        trueText: '是',
        trueValue: 'true',
        falseText: '否',
        falseValue: 'false',
        format: 'string',
        elements: [{
          value: '',
          text: ''
        }],
        elementType: {
          type: '',
          expands: {},
          trueText: '是',
          trueValue: 'true',
          falseText: '否',
          falseValue: 'false',
          format: 'string',
          elements: [{
            value: '',
            text: ''
          }],
          elementType: {
            type: ''
          }
        }
      },
      expands: {
        readOnly: 'false',
        source: ''
      },
      description: ''
    })
    const rules = {
      id: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      valueType: {
        type: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      expands: {
        readOnly: [{ required: true, message: '请选择', trigger: 'blur' }],
        source: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
    const filterOption = (input: string, option: any) => {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
    const addElements = () => {
      formState.valueType.elements.push({
        value: '',
        text: ''
      })
    }
    const removeElements = (index: number) => {
      formState.valueType.elements.splice(1, index)
    }
    watch(() => props.modelValue, (newValue) => {
      modalVisible.value = newValue
      if (newValue) {
        // test
      }
    })
    watch(() => props.data, (newValue) => {
      if (newValue) {
        // test
      }
    })
    const okBtn = () => {
      modalVisible.value = false
      emit('update:modelValue', false)
    }
    const submit = () => {
      // test
    }
    return {
      modalVisible,
      okBtn,
      submit,
      formRef,
      formState,
      rules,
      DataTypeList,
      PropertySource,
      DateTypeList,
      FileTypeList,
      filterOption,
      addElements,
      removeElements
    }
  }
})
</script>
