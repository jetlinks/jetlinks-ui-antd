
<template>
  <a-spin :spinning="spinning">
    <a-card style="width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>今日设备消息量</h4>
        <SyncOutlined @click="deviceMessage" />
      </div>
      <div class="num">{{ sameDay }}</div>
      <div ref="echarts" class="echarts"></div>
      <div class="footer">
        <div>当月设备消息量 {{ month }}</div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import moment from 'moment'
import { getMulti } from '../service'
export default defineComponent({
  setup () {
    const calculationDate = () => {
      const dd = new Date()
      dd.setDate(dd.getDate() - 30)
      const y = dd.getFullYear()
      const m = (dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}` : (dd.getMonth() + 1)
      const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()
      return `${y}-${m}-${d} 00:00:00`
    }
    let myChart: any = null
    const state = reactive({
      xAxisData: [moment(new Date()).format('YYYY-MM-DD')],
      yAxisData: [0],
      echarts: ref(),
      sameDay: 0,
      month: 0,
      spinning: true
    })
    const echartsInit = () => {
      myChart = echarts.init(state.echarts)
      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '0%',
          right: '0%'
        },
        xAxis: {
          show: false,
          data: state.xAxisData,
          type: 'category'
        },
        yAxis: {
          type: 'value',
          show: false,
          boundaryGap: [0, '30%']
        },
        series: [{
          symbol: 'none',
          type: 'line',
          smooth: 0.6,
          areaStyle: {
            opacity: 0.8,
            color: 'rgba(116, 21, 219)'
          },
          lineStyle: {
            width: 2,
            color: 'rgba(116, 21, 219)'
          },
          data: state.yAxisData
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart && myChart.setOption(option)
    }
    const deviceMessage = () => {
      state.spinning = true
      const list = [
        {
          dashboard: 'device',
          object: 'message',
          measurement: 'quantity',
          dimension: 'agg',
          group: 'sameDay',
          params: {
            time: '1d',
            format: 'yyyy-MM-dd'
          }
        },
        {
          dashboard: 'device',
          object: 'message',
          measurement: 'quantity',
          dimension: 'agg',
          group: 'sameMonth',
          params: {
            limit: 30,
            time: '1d',
            format: 'yyyy-MM-dd',
            from: calculationDate(),
            to: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
          }
        },
        {
          dashboard: 'device',
          object: 'message',
          measurement: 'quantity',
          dimension: 'agg',
          group: 'month',
          params: {
            time: '1M',
            format: 'yyyy-MM-dd',
            from: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
            to: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
              case 'sameDay':
                state.sameDay = item.data.value
                break
              case 'month':
                state.month = item.data.value
                break
              case 'sameMonth':
                state.xAxisData.push(moment(new Date(item.data.timeString)).format('YYYY-MM-DD'))
                state.yAxisData.push(item.data.value)
                break
              default:
                break
            }
          })
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
      deviceMessage()
      echartsInit()
    })
    return {
      ...toRefs(state),
      deviceMessage
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
.echarts {
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
