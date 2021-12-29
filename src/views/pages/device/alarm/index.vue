<template>
  <a-tabs tab-position="top" type="card" v-model:activeKey="activeKey" @change="activeChange">
    <a-tab-pane key="1" tab="告警设置">
      <a-card>
        <template #extra>
          <a-button type="primary">新增告警</a-button>
        </template>
        <a-table rowKey="id" :dataSource="dataSource" :columns="columns">
          <template #createTime="slotProps">
            <span>{{ $moment(slotProps.value).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template #state="{ text }">
            <a-badge :color="text.value !== 'stopped' ? 'green' : 'red'" :text="text.text"></a-badge>
          </template>
          <template #operation="{record}">
            <a-space>
              <a>编辑</a>
              <a @click="getAlarmLog(record)">告警日志</a>
              <template v-if="record.state.value === 'stopped'">
                <a @click="startAlarmBtn(record.id)">启动</a>
                <a-popconfirm
                  title="确认删除?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteAlarmBtn(record.id)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </template>
              <a v-else @click="stopAlarmBtn(record.id)">停止</a>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </a-tab-pane>
    <a-tab-pane key="2" tab="告警记录">
      <a-card>
        <template #title>
          <a-select
            v-model:value="value"
            show-search
            placeholder="请选择"
            style="width: 250px"
            :options="options"
            @change="handleChange"
          >
          </a-select>
        </template>
        <a-table
          rowKey="id"
          :dataSource="dataLogSource.data"
          :columns="columnsLog"
          @change="handleTableChange"
          :pagination="{
            pageSize: dataLogSource.pageSize,
            showQuickJumper: false,
            showSizeChanger: false,
            total: dataLogSource.total,
            showTotal: (total) => `共${total}条记录`
          }"
        >
          <template #alarmTime="slotProps">
            <span>{{ $moment(slotProps.value).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template #state="{ text }">
            <template v-if="text === 'solve'">
              <a-tag color="#108ee9">已处理</a-tag>
            </template>
            <template v-else>
              <a-tag color="#f50">未处理</a-tag>
            </template>
          </template>
          <template #operation="{ record }">
            <a-space>
              <a @click="info(record)">详情</a>
              <a v-if="record.state !== 'solve'" @click="solveAlarmLog(record.id)">处理</a>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </a-tab-pane>
  </a-tabs>
  <a-modal v-model:visible="visible" title="告警处理结果" @ok="handleOk" ok-text="确认" cancel-text="取消">
    <a-form ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="处理结果" name="description">
        <a-textarea :rows="4" v-model:value="formState.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { PaginationType } from '@/components/BaseCrud/index.vue'
import encodeQuery from '@/utils/encodeQuery'
import { message, Modal } from 'ant-design-vue'
import { SelectTypes } from 'ant-design-vue/es/select'
import { defineComponent, h, onMounted, reactive, ref, toRaw, UnwrapRef } from 'vue'
import { getAlarmList, deleteAlarm, startAlarm, stopAlarm, getAlarmLogList, solveLog } from './service'
export type AlarmItem = {
  id: string;
  name: string;
  alarmRule?: Record<string, any>;
  createTime?: number;
  state?: {
    text: string;
    value: string;
  };
  target: string;
  targetId: string;
}
export default defineComponent({
  props: ['target', 'targetId'],
  setup (props) {
    const value = ref<string | undefined>(undefined)
    const dataSource = ref<AlarmItem[]>([])
    const searchParams = reactive<any>({
      pageSize: 10,
      terms: {
        productId: props.targetId,
        alarmId: undefined
      },
      sorts: {
        alarmTime: 'desc'
      }
    })
    const options = ref<SelectTypes['options']>([])
    const activeKey = ref<'1' | '2'>('1')
    const formRef = ref()
    const solveId = ref<string>('')
    const dataLogSource = ref<any>({
      data: [],
      pageSize: 10,
      total: 0
    })
    const visible = ref<boolean>(false)
    const formState: UnwrapRef<{description: string}> = reactive({
      description: ''
    })
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        slots: { customRender: 'createTime' },
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        slots: { customRender: 'state' },
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        slots: { customRender: 'operation' }
      }
    ]
    const columnsLog = [
      {
        title: '设备ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        align: 'center'
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        align: 'center'
      },
      {
        title: '告警名称',
        dataIndex: 'alarmName',
        key: 'alarmName',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        slots: { customRender: 'alarmTime' },
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        slots: { customRender: 'state' },
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        slots: { customRender: 'operation' }
      }
    ]
    const handleSearch = () => {
      getAlarmList(props.targetId, props.target).then(resp => {
        if (resp.data.status === 200) {
          dataSource.value = resp.data.result
          const list = resp.data.result.map((item: AlarmItem) => {
            return { label: item.name, value: item.id }
          })
          options.value = [...list]
        }
      })
    }
    const handleLogSearch = (value: string | undefined, pageIndex: number) => {
      searchParams.terms = {
        productId: props.targetId,
        alarmId: value
      }
      searchParams.pageIndex = pageIndex
      getAlarmLogList(encodeQuery(searchParams)).then(resp => {
        if (resp.data.status === 200) {
          dataLogSource.value = resp.data.result
        }
      })
    }

    onMounted(() => {
      handleSearch()
      handleLogSearch(undefined, 1)
    })

    const deleteAlarmBtn = (id: string) => {
      deleteAlarm(id).then(resp => {
        if (resp.data.status === 200) {
          message.success('删除成功！')
          handleSearch()
        }
      })
    }

    const startAlarmBtn = (id: string) => {
      startAlarm(id).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          handleSearch()
        }
      })
    }

    const stopAlarmBtn = (id: string) => {
      stopAlarm(id).then(resp => {
        if (resp.data.status === 200) {
          message.success('操作成功！')
          handleSearch()
        }
      })
    }

    const handleChange = () => {
      handleLogSearch(value.value, 1)
    }

    const filterOption = (input: string, option: any) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    const handleTableChange = (page: PaginationType) => {
      handleLogSearch(value.value, page?.current - 1)
    }

    const getAlarmLog = (data: AlarmItem) => {
      value.value = data.id
      activeKey.value = '2'
      handleLogSearch(data.id, 1)
    }

    const activeChange = () => {
      value.value = undefined
      handleLogSearch(value.value, 1)
    }

    const info = (record: any) => {
      let content: string
      try {
        content = JSON.stringify(record.alarmData, null, 2)
      } catch (error) {
        content = record.alarmData
      }
      Modal.info({
        width: '40VW',
        title: () => '告警数据',
        content: () => h('div', {}, [
          h('pre', content),
          h('h4', '处理结果：'),
          h('pre', record.state !== 'newer' ? record.description : '未处理')
        ]),
        okText: '确定'
      })
    }

    const rules = {
      description: [
        { required: true, message: '请输入', trigger: 'blur' }
      ]
    }
    const solveAlarmLog = (id: string) => {
      visible.value = true
      solveId.value = id
    }
    const handleOk = () => {
      formRef.value.validate().then(() => {
        solveLog(solveId.value, toRaw(formState).description).then(resp => {
          if (resp.data.status === 200) {
            message.success('操作成功')
            handleLogSearch(value.value, searchParams.pageIndex)
          }
          visible.value = false
        })
      })
    }
    return {
      dataSource,
      columns,
      deleteAlarmBtn,
      startAlarmBtn,
      stopAlarmBtn,
      columnsLog,
      dataLogSource,
      filterOption,
      handleChange,
      options,
      value,
      handleTableChange,
      getAlarmLog,
      activeKey,
      activeChange,
      info,
      visible,
      handleOk,
      formState,
      rules,
      formRef,
      solveAlarmLog
    }
  }
})
</script>
