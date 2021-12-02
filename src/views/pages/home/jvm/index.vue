
<template>
  <a-spin :spinning="spinning">
    <a-card style="width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>JVM内存</h4>
      </div>
      <div ref="echarts" class="echarts"></div>
    </a-card>
  </a-spin>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import { getWebsocket } from '@/utils/websocket'
export default defineComponent({
  setup () {
    const state = reactive({
      value: 0,
      max: 0,
      echarts: ref(),
      spinning: true
    })
    let myChart: any = null
    const echartsInit = () => {
      const option = {
        series: [
          {
            type: 'gauge',
            radius: '140%',
            center: ['50%', '80%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: state.max,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [1, '#1890ff']
                ]
              }
            },
            pointer: {
              length: '50%',
              width: 4,
              offsetCenter: [0, '-30%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 25,
              fontSize: 10
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} G',
              color: 'auto',
              fontSize: 25,
              offsetCenter: [0, '0%']
            },
            data: [
              {
                value: state.value
              }
            ]
          }
        ]
      }
      if (myChart) {
        myChart.setOption(option)
      }
    }
    onMounted(() => {
      myChart = echarts.init(state.echarts)
      getWebsocket({
        id: 'home-page-statistics-jvm-realTime',
        topic: '/dashboard/jvmMonitor/memory/info/realTime',
        parameter: { params: { history: 1 } },
        type: 'sub'
      }, (data: any) => {
        state.spinning = false
        state.value = Number((data.payload.value.used / 1024).toFixed(2))
        state.max = Number((data.payload.value.max / 1024).toFixed())
        echartsInit()
      })
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.ant-card /deep/ .ant-card-body {
  padding-bottom: 0;
}
.echarts {
  height: 140.5px;
}
</style>
