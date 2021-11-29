<template>
  <page-container title="产品分类">
    <a-card>
      <template #extra><a-button type="primary" @click="addBtn">新增</a-button></template>
      <a-table :columns="columns" :data-source="data">
        <template #action="{ record }">
          <a-space>
            <a @click="editBtn(record)">编辑</a>
            <a @click="addNextBtn(record)">添加子分类</a>
            <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="delBtn(record)"
            >
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </page-container>
  <a-modal v-model:visible="visible" :title="model === 'add' ? '新增产品分类' : (model === 'edit' ? '编辑产品分类' : '新增子分类')" cancelText="取消" okText="确认" @ok="formOK" @cancel="formCancel">
    <a-form :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="分类ID" name="id">
        <a-input :disabled="model === 'edit'" v-model:value="formState.id" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="分类标识" name="key">
        <a-input v-model:value="formState.key" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="分类名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" :rows="2" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, UnwrapRef, toRaw } from 'vue'
import { query, update, add, remove } from './service'
import encodeQuery from '@/utils/encodeQuery'

const columns = [
  {
    title: '分类ID',
    dataIndex: 'id',
    key: 'id',
    width: '20%',
    align: 'center'
  },
  {
    title: '标识',
    dataIndex: 'key',
    key: 'key',
    width: '20%',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '20%',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '20%',
    align: 'center',
    slots: { customRender: 'action' }
  }
]
interface DataItem {
  id: string;
  key: string;
  level: number;
  name: string;
  parentId: string;
  path: string;
  sortIndex: number;
  children?: DataItem[];
}
interface FormState {
  name: string;
  id: string;
  key: string;
  description: string;
}
export default defineComponent({
  setup () {
    const data: DataItem[] = reactive([])
    const visible = ref<boolean>(false)
    const model = ref<'edit' | 'add' | 'next-add'>('add')
    const rules = {
      id: [{ required: true, message: '请输入' }],
      name: [{ required: true, message: '请输入' }],
      key: [{ required: true, message: '请输入' }]
    }
    const parentId = ref<string>('|0|')
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      id: '',
      key: '',
      description: ''
    })
    const handleSearch = () => {
      query(encodeQuery({
        paging: false,
        sorts: {
          id: 'desc'
        }
      })).then(resp => {
        if (resp.data.status === 200) {
          Object.assign(data, resp.data.result)
        }
      })
    }
    onMounted(() => {
      handleSearch()
    })
    const addBtn = () => {
      parentId.value = '|0|'
      formState.id = ''
      formState.name = ''
      formState.key = ''
      formState.description = ''
      visible.value = true
      model.value = 'add'
    }
    const editBtn = (data: FormState) => {
      visible.value = true
      model.value = 'edit'
      formState.name = data.name
      formState.id = data.id
      formState.key = data.key
      formState.description = data.description
    }
    const addNextBtn = (data: FormState) => {
      parentId.value = data.id
      formState.id = ''
      formState.name = ''
      formState.key = ''
      formState.description = ''
      visible.value = true
      model.value = 'next-add'
    }
    const delBtn = (data: FormState) => {
      remove(data.id).then(resp => {
        if (resp.data.status === 200) {
          handleSearch()
        }
      })
    }
    const formOK = () => {
      if (model.value === 'edit') {
        update(toRaw(formState)).then(resp => {
          if (resp.data.status === 200) {
            handleSearch()
          }
          visible.value = false
        })
      } else {
        add({ ...toRaw(formState), parentId: parentId.value }).then(resp => {
          if (resp.data.status === 200) {
            handleSearch()
          }
          visible.value = false
        })
      }
    }
    const formCancel = () => {
      visible.value = false
    }
    return {
      model,
      data,
      rules,
      columns,
      visible,
      formState,
      addBtn,
      editBtn,
      addNextBtn,
      delBtn,
      formOK,
      formCancel
    }
  }
})
</script>
