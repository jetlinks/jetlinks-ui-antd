<template>
  <div class="searchForm">
    <a-form ref="formRef" layout="horizontal" :model="formStateArray" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20, offset: 0 }">
      <a-row :gutter="{ md: 8, lg: 24, xl: 48 }" style="width: 100%; padding-top: 24px;">
        <a-col :md="8" :sm="24" :span="8" v-for="item in (expand ? formStateArray : formStateArray.slice(0, 2))" :key="item.key">
          <template v-if="item.type === 'select'">
            <a-form-item :label="item.label">
              <a-select :mode="item.mode === 'multiple' ? 'multiple' : 'combobox'"  v-model:value="item.value" placeholder="请选择">
                <a-select-option v-for="option in item.enum" :key="option.value" :value="option.value">{{ option.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </template>
          <template v-else-if="item.type === 'tree-select'">
            <a-form-item :label="item.label">
              <a-tree-select
                v-model:value="item.value"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                :tree-data="item.enum"
              ></a-tree-select>
            </a-form-item>
          </template>
          <template v-else-if="item.type === 'date-picker'">
            <a-form-item :label="item.label">
              <a-range-picker format="" v-model:value="item.value" />
            </a-form-item>
          </template>
          <template v-else>
            <a-form-item :label="item.label">
              <a-input v-model:value="item.value" placeholder="请输入" />
            </a-form-item>
          </template>
        </a-col>
        <div :style="{width: buttonStyle}" style="display: flex; justify-content: flex-end;padding-right: 24px;">
          <a-button type="primary" @click="onSubmit">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
          <template v-if="formStateArray.length > 2">
            <a style="margin: 5px 0 0 20px;" v-if="!expand" @click="setExpand">展开<DownOutlined /></a>
            <a style="margin: 5px 0 0 20px;" v-else @click="setExpand">收起<UpOutlined /></a>
          </template>
        </div>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, UnwrapRef, reactive, ref, toRefs, watch, toRaw, PropType } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
interface EnumState {
  key: string;
  label: string;
  value: string;
  children?: EnumState[]
}
export interface SearchFormState {
  enum?: EnumState[];
  label: string;
  value: string | string[];
  key: string;
  type: string;
  transform?: any;
  mode?: 'multiple' | 'tags' | 'combobox';
}

export default defineComponent({
  name: 'SearchForm',
  props: {
    columns: {
      type: Array as PropType<SearchFormState[]>,
      required: true
    }
  },
  components: {
    DownOutlined,
    UpOutlined
  },
  setup (props, { emit }) {
    const formRef = ref()
    const expand = ref<boolean>(false)
    const { columns } = toRefs(props)
    const buttonStyle = ref<string>(columns.value.length % 3 === 1 ? '66%' : '33%')
    const formStateArray = reactive<UnwrapRef<SearchFormState[]>>((columns.value as unknown) as SearchFormState[])
    if (columns.value) {
      watch([columns, expand], ([newValue, newExpand]) => {
        const num = newValue.length % 3
        if (newExpand || newValue.length < 3) {
          if (num === 0) {
            buttonStyle.value = '100%'
          } else if (num === 1) {
            buttonStyle.value = '66%'
          }
        } else {
          buttonStyle.value = '33%'
        }
      }, {
        deep: true
      })
    }
    const setExpand = () => {
      expand.value = !expand.value
    }
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let terms: any = {}
          toRaw(formStateArray).map((item: SearchFormState) => {
            if (item.key && item.value) {
              if (item.transform) {
                const obj = item.transform(item.value)
                terms = {
                  ...terms,
                  ...obj
                }
              } else {
                terms[item.key] = item.value
              }
            }
          })
          emit('on-search', terms)
        })
    }
    const resetForm = () => {
      formStateArray.map(item => {
        if (item.mode && item.mode === 'multiple') {
          item.value = []
        } else {
          item.value = ''
        }
      })
      emit('on-search', undefined)
    }
    return {
      formRef,
      expand,
      formStateArray,
      buttonStyle,
      setExpand,
      onSubmit,
      resetForm
    }
  }
})
</script>
