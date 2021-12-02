
<template>
  <a-spin :spinning="spinning">
    <a-card style="width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>CPU使用率</h4>
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
      echarts: ref(),
      spinning: true
    })
    let myChart: any = null
    const echartsInit = () => {
      const option = {
        // series: [
        //   {
        //     type: 'gauge',
        //     radius: '95%',
        //     center: ['48%', '50%'],
        //     startAngle: 90,
        //     endAngle: -270,
        //     pointer: {
        //       show: false
        //     },
        //     progress: {
        //       show: true,
        //       overlap: false,
        //       roundCap: true,
        //       clip: false,
        //       itemStyle: {
        //         color: 'rgba(224, 62, 76)'
        //       }
        //     },
        //     axisLine: {
        //       lineStyle: {
        //         width: 15
        //       }
        //     },
        //     splitLine: {
        //       show: false,
        //       distance: 0,
        //       length: 10
        //     },
        //     axisTick: {
        //       show: false
        //     },
        //     axisLabel: {
        //       show: false,
        //       distance: 50
        //     },
        //     data: [
        //       {
        //         value: state.value
        //       }
        //     ],
        //     title: {
        //       fontSize: 14
        //     },
        //     detail: {
        //       width: 50,
        //       height: 14,
        //       fontSize: 14,
        //       color: 'auto',
        //       offsetCenter: [0, '0%'],
        //       formatter: '{value}%'
        //     }
        //   }
        // ]
        series: [
          {
            type: 'gauge',
            radius: '140%',
            center: ['50%', '80%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [1, 'rgba(0, 0, 180, 1)']
                ]
              }
            },
            pointer: {
              length: '40%',
              width: 4,
              offsetCenter: [0, '-40%'],
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
              formatter: '{value} %',
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
      echartsInit()
      getWebsocket({
        id: 'home-page-statistics-cpu-realTime',
        topic: '/dashboard/systemMonitor/cpu/usage/realTime',
        parameter: { params: { history: 1 } },
        type: 'sub'
      }, (data: any) => {
        state.value = data.payload.value
        state.spinning = false
        myChart.setOption({
          series: [
            {
              data: [
                {
                  value: state.value
                }
              ]
            }
          ]
        })
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
