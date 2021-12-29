
<template>
  <a-spin :spinning="spinning">
    <a-card style="width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>当前在线</h4>
        <SyncOutlined @click="deviceStatus" />
      </div>
      <div class="num">{{ deviceOnline }}</div>
      <div ref="chart" class="chart"></div>
      <div class="footer">
        <div>设备总数 {{ deviceCount }}</div>
        <div>未激活设备 {{ deviceNotActive }}</div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import { getMulti } from '../service'
import moment from 'moment'
export default defineComponent({
  setup () {
    const state = reactive({
      xAxisData: [moment(new Date()).format('YYYY-MM-DD')],
      yAxisData: [0],
      chart: ref(),
      deviceOnline: 0,
      deviceCount: 0,
      deviceNotActive: 0,
      spinning: true
    })
    let myChart: any = null
    const echartsInit = () => {
      myChart = echarts.init(state.chart)
      const option = {
        grid: {
          left: '0%',
          right: '3%'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          show: false,
          data: []
        },
        yAxis: {
          show: false
        },
        series: [{
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          data: []
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart && myChart.setOption(option)
    }
    const deviceStatus = () => {
      state.spinning = true
      const list = [
        // 设备状态信息-在线
        {
          dashboard: 'device',
          object: 'status',
          measurement: 'record',
          dimension: 'current',
          group: 'deviceOnline',
          params: {
            state: 'online'
          }
        }, // 设备状态信息-总数
        {
          dashboard: 'device',
          object: 'status',
          measurement: 'record',
          dimension: 'current',
          group: 'deviceCount'
        }, // 设备状态信息-未激活
        {
          dashboard: 'device',
          object: 'status',
          measurement: 'record',
          dimension: 'current',
          group: 'deviceNotActive',
          params: {
            state: 'notActive'
          }
        }, // 设备状态信息-历史在线
        {
          dashboard: 'device',
          object: 'status',
          measurement: 'record',
          dimension: 'aggOnline',
          group: 'aggOnline',
          params: {
            limit: 20,
            time: '1d',
            format: 'yyyy-MM-dd'
          }
        }
      ]
      getMulti(list).then((response: any) => {
        const tempResult = response.data.result
        if (response.data.status === 200) {
          state.xAxisData = []
          state.yAxisData = []
          tempResult.forEach((item: any) => {
            switch (item.group) {
              case 'aggOnline':
                state.xAxisData.push(moment(new Date(item.data.timeString)).format('YYYY-MM-DD'))
                state.yAxisData.push(item.data.value)
                break
              case 'deviceOnline':
                state.deviceOnline = item.data.value
                break
              case 'deviceCount':
                state.deviceCount = item.data.value
                break
              case 'deviceNotActive':
                state.deviceNotActive = item.data.value
                break
              default:
                break
            }
          })
          state.xAxisData = state.xAxisData.reverse()
          state.yAxisData = state.yAxisData.reverse()
          myChart.setOption({
            xAxis: {
              data: [...state.xAxisData]
            },
            series: [
              {
                data: [...state.yAxisData]
              }
            ]
          })
        }
        state.spinning = false
      })
    }
    onMounted(() => {
      deviceStatus()
      /**
       * echarts图形只绘制一次,且绘制时自动获取父级大小填写宽度
       * 考虑让echarts延迟绘制 使用setTimeout
       */
      setTimeout(() => {
        echartsInit()
      })
    })
    return {
      ...toRefs(state),
      deviceStatus
    }
  }
})
</script>

<style scoped lang="less">
.ant-card /deep/ .ant-card-body {
  padding-bottom: 0;
}
.num {
  font-size: 30px;
  color: rgba(0,0,0,.85);
}
.chart {
  height: 50px;
  margin: -5px 0 10px 0;
}
.footer {
  display: flex;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  margin-top: 8px;
  padding: 8px;
  justify-content: space-between;
  color: #000000A6;
}
</style>
