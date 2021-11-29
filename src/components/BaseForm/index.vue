<template>
  <a-form :layout="form.layout">
    <template v-for="item in form.formItems" :key="item.name">
      <template v-if="item.visible !== false">
        <a-form-item :label="item.label" :name="(item.name).indexOf('.') !== -1 ? item.name.split('.') : item.name" v-bind="validateInfos[item.name]">
          <template v-if="item.formItemOptions.type === 'upload'">
            <FormUpload v-model:value="model[item.name]" />
          </template>
          <template v-if="item.formItemOptions.type === 'input'">
            <a-input
              @change="eventChange($event, item.name)"
              :disabled="item.formItemOptions.disabled"
              :type="item.formItemOptions.inputTypes"
              :value="setInputValue(item.name)"
              @input="inputChange($event, item.name)"
              :placeholder="item.formItemOptions.placeholder" />
          </template>
          <template v-if="item.formItemOptions.type === 'select'">
            <a-select @change="eventChange($event, item.name)" v-model:value="model[item.name]" :placeholder="item.formItemOptions.placeholder">
              <template v-for="option in item.formItemOptions.enum" :key="option.value">
                <a-select-option :value="option.value">{{ option.label }}</a-select-option>
              </template>
            </a-select>
          </template>
          <template v-if="item.formItemOptions.type === 'date'">
            <a-date-picker
              v-model:value="model[item.name]"
              show-time
              type="date"
              :placeholder="item.formItemOptions.placeholder"
              style="width: 100%"
            />
          </template>
          <template v-if="item.formItemOptions.type === 'switch'">
            <a-switch v-model:checked="model[item.name]" />
          </template>
          <template v-if="item.formItemOptions.type === 'checkbox'">
            <a-checkbox-group v-model:value="model[item.name]" >
              <template v-for="option in item.formItemOptions.enum" :key="option.value">
                <a-checkbox :value="option.value">{{ option.label }}</a-checkbox>
              </template>
            </a-checkbox-group>
          </template>
          <template v-if="item.formItemOptions.type === 'radio'">
            <a-radio-group v-model:value="model[item.name]">
              <template v-for="option in item.formItemOptions.enum" :key="option.value">
                <a-radio :value="option.value">{{ option.label }}</a-radio>
              </template>
            </a-radio-group>
          </template>
          <template v-if="item.formItemOptions.type === 'textarea'">
            <a-textarea v-model:value="model[item.name]" :row="3" />
          </template>
        </a-form-item>
      </template>
    </template>
    <div style="display: flex; justify-content: flex-end; border-top: 1px solid #f0f0f0;margin-top: 10px; padding-top: 16px;">
      <a-button @click="onCancel">取消</a-button>
      <a-button style="margin-left: 10px" type="primary" @click.prevent="onSubmit">确定</a-button>
    </div>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, watch, toRaw, computed, ref } from 'vue'
import { FormProps } from '@/components/BaseForm/typing.d.ts'
import { Form } from 'ant-design-vue'
import FormUpload from '@/components/FormUpload/index.vue'
const useForm = Form.useForm
export default defineComponent({
  name: 'BaseForm',
  props: {
    formPar: {
      require: true,
      default: () => ({}),
      type: Object as PropType<FormProps>
    },
    modelValue: {
      type: Object,
      default: () => ({}),
      require: true
    }
  },
  emits: ['update:modelValue', 'form-ok', 'form-cancel', 'event-change'],
  components: { FormUpload },
  setup: function (props, { emit }) {
    const form = reactive<FormProps>((props.formPar as unknown) as FormProps)
    const rules: any = reactive({})
    const model = reactive({ ...props.modelValue })
    form.formItems.map((item) => {
      rules[item.name] = [
        {
          ...item.rules
        }
      ]
    })
    const {
      validate,
      validateInfos,
      resetFields
    } = useForm(model, rules)
    watch(() => props.modelValue, (newValue) => {
      // console.log(newValue)
      Object.assign(model, newValue)
    }, {
      deep: true
    })
    const onSubmit = () => {
      validate()
        .then(() => {
          emit('update:modelValue', toRaw(model))
          emit('form-ok', toRaw(model))
        })
        .catch(err => {
          console.log('error', err)
        })
    }
    const setDeepValue = (object: any, path: string[], value: any) => {
      const fieldPath = [...path]
      if (fieldPath.length) {
        const key = fieldPath.shift() || ''
        if (object && object[key]) {
          object[key] = setDeepValue(object[key], fieldPath, value)
        }
      } else {
        object = value
      }
      return object
    }
    const inputChange = ($event: any, name: string) => {
      const value = $event.target.value
      if (name.indexOf('.') !== -1) {
        const obj = setDeepValue({ ...toRaw(model) }, name.split('.'), value)
        delete obj[name]
      } else {
        model[name] = value
      }
    }
    const setInputValue = computed(() => (name: string) => {
      // eslint-disable-next-line no-eval
      return eval('model.' + name)
    })
    const onCancel = () => {
      resetFields()
      emit('update:modelValue', {})
      emit('form-cancel')
    }
    const eventChange = (event: any, name: string) => {
      emit('event-change', {
        event,
        name
      })
    }
    return {
      form,
      validateInfos,
      resetFields,
      onSubmit,
      onCancel,
      model,
      eventChange,
      inputChange,
      setInputValue
    }
  }
})
</script>
