import { PageContainer } from '@ant-design/pro-layout';
import { Col, message, Row } from 'antd';
import { PermissionButton } from '@/components';
import { getMenuPathByCode } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';
import { useEffect, useRef, useState } from 'react';
import { Body, Guide } from '@/pages/home/components';
import CardStatistics from '@/pages/home/components/CardStatics';
import Echarts from '@/components/DashBoard/echarts';
import { EChartsOption } from 'echarts';
import moment from 'moment';
import Service from './service';

export const service = new Service('');

export default () => {
  const dashBoardUrl = getMenuPathByCode('iot-card/Dashboard');
  const platformUrl = getMenuPathByCode('iot-card/Platform/Detail');
  const recordUrl = getMenuPathByCode('iot-card/Record');
  const cardUrl = getMenuPathByCode('iot-card/CardManagement');

  const [options, setOptions] = useState<EChartsOption>({});
  const [cardOptions, setCardOptions] = useState<EChartsOption>({});
  const currentSource = useRef(0);
  const pieChartData = useRef([
    {
      key: 'using',
      name: '正常',
      value: 0,
      className: 'normal',
    },
    {
      key: 'toBeActivated',
      name: '未激活',
      value: 0,
      className: 'notActive',
    },
    {
      key: 'deactivate',
      name: '停用',
      value: 0,
      className: 'stopped',
    },
  ]);

  const { permission: paltformPermission } = PermissionButton.usePermission('iot-card/Platform');

  const history = useHistory();

  //昨日流量
  const getTodayFlow = async () => {
    const beginTime = moment().subtract(1, 'days').startOf('day').valueOf();
    const endTime = moment().subtract(1, 'days').endOf('day').valueOf();
    const res = await service.queryFlow(beginTime, endTime, { orderBy: 'date' });
    if (res.status === 200) {
      res.result.map((item: any) => {
        currentSource.current += parseFloat(item.value.toFixed(2));
      });
    }
  };

  //15天流量
  const get15DaysTrafficConsumption = async () => {
    const beginTime = moment().subtract(15, 'days').startOf('day').valueOf();
    const endTime = moment().subtract(1, 'days').endOf('day').valueOf();
    const resp = await service.queryFlow(beginTime, endTime, { orderBy: 'date' });
    if (resp.status === 200) {
      setOptions({
        tooltip: {},
        xAxis: {
          show: false,
          data: resp.result.map((item: any) => item.date).reverse(),
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            name: '流量消耗',
            type: 'bar',
            color: '#FACD89',
            // barWidth: '5%', // 设单柱状置宽度
            showBackground: true, //设置柱状的背景虚拟
            data: resp.result.map((m: any) => parseFloat(m.value.toFixed(2))).reverse(),
          },
        ],
      });
    }
  };
  //获取物联卡状态数据
  const getStateCard = async () => {
    Promise.all(
      pieChartData.current.map((item) => {
        const params = {
          terms: [
            {
              terms: [
                {
                  column: 'cardStateType',
                  termType: 'eq',
                  value: item.key,
                },
              ],
            },
          ],
        };
        return service.list(params);
      }),
    ).then((res) => {
      res.forEach((item, index) => {
        if (item && item.status === 200) {
          pieChartData.current[index].value = item.result.total;
        }
      });
      setCardOptions({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        color: ['#85a5ff', '#f29b55', '#c4c4c4'],
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: true, //是否启用防止标签重叠策略
            radius: ['50%', '90%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: 'rgba(255,255,255,1)',
              borderWidth: 2,
            },
            label: {
              show: false,
            },
            data: pieChartData.current,
          },
        ],
      });
    });
  };

  const guideList = [
    {
      key: 'EQUIPMENT',
      name: '平台对接',
      english: 'STEP1',
      auth: !!paltformPermission.update,
      url: platformUrl,
    },
    {
      key: 'SCREEN',
      name: '物联卡管理',
      english: 'STEP2',
      auth: !!cardUrl,
      url: cardUrl,
      param: { save: true },
    },
    {
      key: 'CASCADE',
      name: '操作记录',
      english: 'STEP3',
      auth: !!recordUrl,
      url: recordUrl,
    },
  ];

  useEffect(() => {
    getTodayFlow();
    get15DaysTrafficConsumption();
    getStateCard();
  }, []);

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={14}>
          <Guide title={'物联卡引导'} data={guideList} />
        </Col>
        <Col span={10}>
          <CardStatistics
            title={'基础统计'}
            data={[
              {
                name: '昨日流量统计',
                value: `${currentSource.current}M`,
                children: <Echarts options={options} />,
              },
              {
                name: '物联卡',
                value: 0,
                node: pieChartData.current,
                children: <Echarts options={cardOptions} />,
              },
            ]}
            extra={
              <div style={{ fontSize: 14, fontWeight: 400 }}>
                <a
                  onClick={() => {
                    if (!!dashBoardUrl) {
                      history.push(`${dashBoardUrl}`);
                    } else {
                      message.warning('暂无权限，请联系管理员');
                    }
                  }}
                >
                  详情
                </a>
              </div>
            }
          />
        </Col>
        <Col span={24}>
          <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
        </Col>
      </Row>
    </PageContainer>
  );
};
