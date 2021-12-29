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
      <a-form-item v-if="formState.valueType.type === 'float' || formState.valueType.type === 'double'" label="精度" :name="['valueType', 'scale']">
        <a-input v-model:value="formState.valueType.scale" />
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'float' || formState.valueType.type === 'double' || formState.valueType.type === 'int' || formState.valueType.type === 'long'" label="单位" :name="['valueType', 'unit']">
        <RenderUnit v-model:value="formState.valueType.elementType.unit" />
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'string' || formState.valueType.type === 'password'" label="最大长度" :name="['valueType', 'expands', 'maxLength']">
        <a-input v-model:value="formState.valueType.expands.maxLength" />
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'boolean'" label="布尔值">
        <a-row :gutter="24">
          <a-col :span="10">
            <a-input v-model:value="formState.valueType.trueText" />
          </a-col>
          <a-col :col="4">~</a-col>
          <a-col :span="10">
            <a-input v-model:value="formState.valueType.trueValue" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'boolean'" label="">
        <a-row :gutter="24">
          <a-col :span="10">
            <a-input v-model:value="formState.valueType.falseText" />
          </a-col>
          <a-col :col="4">~</a-col>
          <a-col :span="10">
            <a-input v-model:value="formState.valueType.falseValue" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'date'" :name="['valueType', 'format']" label="时间格式">
        <a-auto-complete
          v-model:value="formState.valueType.format"
          :options="DateTypeList"
          :filter-option="filterOption"
          placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
        />
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'file'" label="文件类型" :name="['valueType', 'fileType']">
        <a-select v-model:value="formState.valueType.fileType" placeholder="请选择">
          <template v-for="item in FileTypeList" :key="item.value">
            <a-select-option :value="item.value">{{ item.label }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item v-if="formState.valueType.type === 'object'" label="JSON对象">
        <a><PlusOutlined style="margin: 0 10px;" />添加参数</a>
      </a-form-item>
      <template v-if="formState.valueType.type === 'enum'">
        <a-form-item v-for="(item, index) in formState.valueType.elements" :key="index" :label="index === 0 ? '枚举项' : ''">
          <a-row :gutter="24">
            <a-col :span="10">
              <a-input placeholder="标识" v-model:value="formState.valueType.elements[index].text" />
            </a-col>
            <a-col :span="2"><ArrowRightOutlined style="margin-top: 10px;" /></a-col>
            <a-col :span="10">
              <a-input placeholder="对该枚举项的描述" v-model:value="formState.valueType.elements[index].value" />
            </a-col>
            <a-col :span="2">
              <MinusCircleOutlined v-if="formState.valueType.elements.length > 1" class="dynamic-delete-button" @click="removeElements(index)"/>
            </a-col>
          </a-row>
        </a-form-item>
        <a-button @click="addElements" type="dashed" style="width: 95%; margin-bottom: 20px;"><PlusOutlined />新增</a-button>
      </template>
      <template v-if="formState.valueType.type === 'array'">
        <a-form-item label="元素类型" :name="['valueType', 'elementType', 'type']">
          <a-select v-model:value="formState.valueType.elementType.type" placeholder="请选择">
            <template v-for="item in DataTypeList" :key="item.value">
              <a-select-option :value="item.value" v-if="item.value !== 'array'">{{ item.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'float' || formState.valueType.elementType.type === 'double'" label="精度" :name="['valueType', 'elementType', 'scale']">
          <a-input v-model:value="formState.valueType.elementType.scale" />
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'float' || formState.valueType.elementType.type === 'double' || formState.valueType.elementType.type === 'int' || formState.valueType.elementType.type === 'long'" label="单位" :name="['valueType', 'elementType', 'unit']">
          <RenderUnit v-model:value="formState.valueType.elementType.unit" />
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'string' || formState.valueType.elementType.type === 'password'" label="最大长度" :name="['valueType', 'elementType', 'expands', 'maxLength']">
          <a-input v-model:value="formState.valueType.elementType.expands.maxLength" />
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'boolean'" label="布尔值">
          <a-row :gutter="24">
            <a-col :span="10">
              <a-input v-model:value="formState.valueType.elementType.trueText" />
            </a-col>
            <a-col :col="4">~</a-col>
            <a-col :span="10">
              <a-input v-model:value="formState.valueType.elementType.trueValue" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'boolean'" label="">
          <a-row :gutter="24">
            <a-col :span="10">
              <a-input v-model:value="formState.valueType.elementType.falseText" />
            </a-col>
            <a-col :col="4">~</a-col>
            <a-col :span="10">
              <a-input v-model:value="formState.valueType.elementType.falseValue" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'date'" :name="['valueType', 'elementType', 'format']" label="时间格式">
          <a-auto-complete
            v-model:value="formState.valueType.elementType.format"
            :options="DateTypeList"
            :filter-option="filterOption"
            placeholder="默认格式：String类型的UTC时间戳 (毫秒)"
          />
        </a-form-item>
        <a-form-item v-if="formState.valueType.elementType.type === 'file'" label="文件类型" :name="['valueType', 'elementType', 'fileType']">
          <a-select v-model:value="formState.valueType.elementType.fileType" placeholder="请选择">
            <template v-for="item in FileTypeList" :key="item.value">
              <a-select-option :value="item.value">{{ item.label }}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <template v-if="formState.valueType.elementType.type === 'enum'">
          <a-form-item v-for="(item, index) in formState.valueType.elementType.elements" :key="index" :label="index === 0 ? '枚举项' : ''">
            <a-row :gutter="24">
              <a-col :span="10">
                <a-input placeholder="标识" v-model:value="formState.valueType.elementType.elements[index].text" />
              </a-col>
              <a-col :span="2"><ArrowRightOutlined style="margin-top: 10px;" /></a-col>
              <a-col :span="10">
                <a-input placeholder="对该枚举项的描述" v-model:value="formState.valueType.elementType.elements[index].value" />
              </a-col>
              <a-col :span="2">
                <MinusCircleOutlined v-if="formState.valueType.elementType.elements.length > 1" class="dynamic-delete-button" @click="removeElements(index)"/>
              </a-col>
            </a-row>
          </a-form-item>
          <a-button @click="addElements" type="dashed" style="width: 95%; margin-bottom: 20px;"><PlusOutlined />新增</a-button>
        </template>
      </template>
      <a-form-item label="是否只读" :name="['expands', 'readOnly']">
        <a-radio-group v-model:value="formState.expands.readOnly">
          <a-radio value="true">是</a-radio>
          <a-radio value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="属性来源" :name="['expands', 'source']">
        <a-select v-model:value="formState.expands.source" placeholder="请选择">
          <template v-for="item in PropertySource" :key="item.value">
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
import RenderUnit from './RenderUnit.vue'
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
  name: 'Authorization',
  props: ['modelValue', 'data'],
  emits: ['update:modelValue'],
  components: { RenderUnit },
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
