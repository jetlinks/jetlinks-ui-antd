<template>
  <a-card title="设备消息" style="margin-top: 20px">
    <template #extra>
      <div>
        <a-radio-group button-style="solid" v-model:value="time" style="margin-right: 20px;" @change="deviceTime">
          <a-radio-button value="1m">1小时</a-radio-button>
          <a-radio-button value="24m">1天</a-radio-button>
          <a-radio-button value="168m">7天</a-radio-button>
          <a-radio-button value="12h">30天</a-radio-button>
        </a-radio-group>
        <a-date-picker @ok="selectTime" :allowClear="false" show-time v-model:value="selectionTime" format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" />
      </div>
    </template>
    <a-spin :spinning="spinning">
      <div ref="echarts" style="height: 500px;"></div>
    </a-spin>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import { getMulti } from '../service'
import moment, { Moment } from 'moment'
export default defineComponent({
  setup () {
    const calculationDate = (val: number) => {
      const dd = new Date()
      dd.setDate(dd.getDate() - val)
      return moment(dd).format('YYYY-MM-DD HH:mm:ss')
    }
    const state = reactive({
      data: [[]],
      echarts: ref(),
      time: '1m',
      spinning: true,
      selectionTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    })
    let myChart: any = null
    const echartsInit = () => {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '3%'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          symbol: 'none',
          type: 'line',
          areaStyle: {},
          data: state.data
        }]
      }
      if (myChart) {
        myChart.setOption(option)
      }
    }
    const gatewayMonitor = (from: string, to: string, time: string) => {
      state.spinning = true
      let formatData = ''
      if (time === '1m') {
        formatData = 'HH时mm分'
      } else if (time === '12h') {
        formatData = 'MM月dd日HH时'
      } else {
        formatData = 'MM月dd日HH时mm分'
      }
      const list = [
        {
          dashboard: 'gatewayMonitor',
          object: 'deviceGateway',
          measurement: 'received_message',
          dimension: 'agg',
          group: 'sameDay',
          params: {
            time: time || '1m',
            limit: 60,
            format: formatData,
            from: from,
            to: to
          }
        }
      ]
      getMulti(list)
        .then((response: any) => {
          const tempResult = response.data.result
          if (response.data.status === 200) {
            const dataList: any[] = []
            tempResult.forEach((item: any) => {
              dataList.push([item.data.timeString, item.data.value])
            })
            state.data = dataList
            echartsInit()
          }
          state.spinning = false
        })
    }
    const formatData = (value: any) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    onMounted(() => {
      myChart = echarts.init(state.echarts)
      const da = new Date()
      da.setHours(da.getHours() - 1)
      gatewayMonitor(formatData(da), calculationDate(0), '1m')
    })
    const deviceTime = (e: any) => {
      const value = e.target.value
      state.time = value
      const dd = new Date(state.selectionTime)
      const to = moment(state.selectionTime).format('YYYY-MM-DD HH:mm:ss')
      let from = to
      if (value === '1m') {
        dd.setHours(dd.getHours() - 1)
        from = moment(state.selectionTime).subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
      } else if (value === '24m') {
        dd.setDate(dd.getDate() - 1)
        from = moment(state.selectionTime).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      } else if (value === '168m') {
        dd.setDate(dd.getDate() - 7)
        from = moment(state.selectionTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
      } else if (value === '12h') {
        dd.setDate(dd.getDate() - 30)
        from = moment(state.selectionTime).subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
      gatewayMonitor(from, to, value)
    }
    const selectTime = (value: Moment) => {
      if (value) {
        state.selectionTime = moment(value).format('YYYY-MM-DD HH:mm:ss')
        const dd = new Date(state.selectionTime)
        if (state.time === '1m') {
          dd.setHours(dd.getHours() - 1)
        } else if (state.time === '24m') {
          dd.setDate(dd.getDate() - 1)
        } else if (state.time === '168m') {
          dd.setDate(dd.getDate() - 7)
        } else if (state.time === '12h') {
          dd.setDate(dd.getDate() - 30)
        }
        gatewayMonitor(formatData(dd), formatData(value), state.time)
      }
    }
    return {
      ...toRefs(state),
      deviceTime,
      selectTime
    }
  }
})
</script>
