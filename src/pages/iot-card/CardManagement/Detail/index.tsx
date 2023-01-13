import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Descriptions, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PermissionButton, DashBoard, Ellipsis } from '@/components';
import SaveModal from '../SaveModal';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardManagement } from '@/pages/iot-card/CardManagement/typing';
import { useParams } from 'umi';
import { service } from '../index';
import type { EChartsOption } from 'echarts';
import Echarts from '@/components/DashBoard/echarts';
import moment from 'moment';
import './index.less';

const DefaultEchartsOptions: any = {
  yAxis: {
    type: 'value',
    show: false,
  },
  grid: {
    top: '5%',
    left: '2%',
    right: '3%',
    bottom: 20,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
};

const CardDetail = () => {
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState<Partial<CardManagement>>({});
  const { permission } = PermissionButton.usePermission('device/Instance');
  const [options, setOptions] = useState<EChartsOption>({});
  const [dayOptions, setDayOptions] = useState<EChartsOption>({});
  const [monthOptions, setMonthOptions] = useState<EChartsOption>({});
  const [yearOptions, setYearOptions] = useState<EChartsOption>({});
  const [dayTotal, setTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [yearTotal, setYearTotal] = useState(0);
  const echartsRef = useRef<any>();
  const params = useParams<{ id: string }>();

  const getDetail = useCallback(
    (id?: string) => {
      if (id) {
        service.detail(id).then((resp) => {
          if (resp.status === 200) {
            setDetail(resp.result);
          }
        });
      }
    },
    [params.id],
  );

  const getData = useCallback(
    (start: number, end: number): Promise<{ xValue: any[]; data: any[] }> => {
      return new Promise((resolve) => {
        service
          .queryFlow(start, end, {
            orderBy: 'date',
            terms: [
              {
                column: 'cardId',
                termType: 'eq',
                value: params.id,
              },
            ],
          })
          .then((resp) => {
            if (resp.status === 200) {
              const sortArray = resp.result.sort(
                (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
              );
              resolve({
                xValue: sortArray.map((item: any) => item.date),
                data: sortArray.map((item: any) => item.value && item.value.toFixed(2)),
              });
            }
          });
      });
    },
    [params.id],
  );

  const getDataTotal = useCallback(() => {
    if (!params.id) return;
    const dTime = [
      moment().subtract(1, 'days').startOf('day').valueOf(),
      moment().subtract(1, 'days').endOf('day').valueOf(),
    ];
    const mTime = [moment().startOf('month').valueOf(), moment().endOf('month').valueOf()];
    const yTime = [moment().startOf('year').valueOf(), moment().endOf('year').valueOf()];
    const grid: any = {
      top: '2%',
      left: '0',
      right: 0,
      bottom: 0,
    };
    getData(dTime[0], dTime[1]).then((resp) => {
      const _total = resp.data.reduce((r, n) => r + Number(n), 0);
      setTotal(_total ? _total.toFixed(2) : 0);
      setDayOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#FBA500',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#FBA500', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
    getData(mTime[0], mTime[1]).then((resp) => {
      const _total = resp.data.reduce((r, n) => r + Number(n), 0);
      setMonthTotal(_total ? _total.toFixed(2) : 0);
      setMonthOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#498BEF',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#498BEF', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
    getData(yTime[0], yTime[1]).then((resp) => {
      const _total = resp.data.reduce((r, n) => r + Number(n), 0);
      setYearTotal(_total ? _total.toFixed(2) : 0);
      setYearOptions({
        ...DefaultEchartsOptions,
        grid,
        xAxis: {
          type: 'category',
          data: resp.xValue,
          show: false,
        },
        series: [
          {
            name: '流量',
            data: resp.data,
            type: 'line',
            color: '#58E1D3',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#58E1D3', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    });
  }, [params.id]);

  const getEcharts = useCallback(
    (data: any) => {
      if (!params.id) return;
      let startTime = data.time.start;
      let endTime = data.time.end;
      if (data.time.type === 'week' || data.time.type === 'month') {
        startTime = moment(data.time.start).startOf('days').valueOf();
        endTime = moment(data.time.end).startOf('days').valueOf();
      }
      getData(startTime, endTime).then((resp) => {
        setOptions({
          ...DefaultEchartsOptions,
          xAxis: {
            type: 'category',
            data: resp.xValue,
          },
          series: [
            {
              name: '流量',
              data: resp.data,
              type: 'line',
              color: '#498BEF',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#498BEF', // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#FFFFFF', //   0% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
          ],
        });
      });
    },
    [params.id],
  );

  useEffect(() => {
    getDetail(params.id || '');

    getEcharts(echartsRef?.current?.getValues());
    getDataTotal();
  }, [params.id]);

  return (
    <PageContainer>
      {visible && (
        <SaveModal
          type={'edit'}
          data={detail}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={() => {
            getDetail(params.id);
            setVisible(false);
          }}
        />
      )}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Descriptions
              size="small"
              column={3}
              bordered
              title={[
                <span key={1}>基本信息</span>,
                <PermissionButton
                  isPermission={permission.update}
                  key={2}
                  type={'link'}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <EditOutlined />
                  编辑
                </PermissionButton>,
              ]}
            >
              <Descriptions.Item label={'卡号'}>{detail.id}</Descriptions.Item>
              <Descriptions.Item label={'ICCID'}>{detail.iccId}</Descriptions.Item>
              <Descriptions.Item label={'绑定设备'}>{detail.deviceName}</Descriptions.Item>
              <Descriptions.Item label={'平台类型'}>
                {detail.operatorPlatformType?.text}
              </Descriptions.Item>
              <Descriptions.Item label={'平台名称'}>{detail.platformConfigName}</Descriptions.Item>
              <Descriptions.Item label={'运营商'}>{detail.operatorName}</Descriptions.Item>
              <Descriptions.Item label={'类型'}>{detail.cardType?.text}</Descriptions.Item>
              <Descriptions.Item label={'激活日期'}>
                {detail.activationDate
                  ? moment(detail.activationDate).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Descriptions.Item>
              <Descriptions.Item label={'更新时间'}>
                {detail.updateTime ? moment(detail.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''}
              </Descriptions.Item>
              <Descriptions.Item label={'总流量'}>
                {detail.totalFlow ? detail.totalFlow.toFixed(2) + ' M' : ''}
              </Descriptions.Item>
              <Descriptions.Item label={'使用流量'}>
                {detail.usedFlow ? detail.usedFlow.toFixed(2) + ' M' : ''}
              </Descriptions.Item>
              <Descriptions.Item label={'剩余流量'}>
                {detail.residualFlow ? detail.residualFlow.toFixed(2) + ' M' : ''}
              </Descriptions.Item>
              <Descriptions.Item label={'状态'}>{detail?.cardState?.text}</Descriptions.Item>
              <Descriptions.Item label={'说明'}>
                <Ellipsis
                  title={detail?.describe}
                  tooltip={{ placement: 'topLeft' }}
                  style={{ maxWidth: 300 }}
                  limitWidth={300}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <div className={'iot-card-detail-total'}>
            <div className={'iot-card-detail-total-left'}>
              <DashBoard
                ref={echartsRef}
                title={'流量统计'}
                options={options}
                defaultTime={'week'}
                timeToolOptions={[
                  { label: '昨日', value: 'yesterday' },
                  { label: '近一周', value: 'week' },
                  { label: '近一月', value: 'month' },
                ]}
                showTime={true}
                showTimeTool={true}
                height={500}
                onParamsChange={getEcharts}
              />
            </div>
            <div className={'iot-card-detail-total-right'}>
              <div
                style={{
                  marginBottom: 20,
                  color: '#323130',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                数据统计
              </div>
              <div className={'iot-card-detail-total-item'}>
                <Row>
                  <Col flex={'auto'}>
                    <div className={'detail-total-item-name'}>昨日流量消耗</div>
                    <div className={'detail-total-item-content'}>
                      <span className={'detail-total-item-value'}>{dayTotal}</span>
                      <span>M</span>
                    </div>
                  </Col>
                  <Col flex={'240px'}>
                    <div style={{ height: 83 }}>
                      <Echarts options={dayOptions} />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={'iot-card-detail-total-item'}>
                <Row>
                  <Col flex={'auto'}>
                    <div className={'detail-total-item-name'}>当月流量消耗</div>
                    <div className={'detail-total-item-content'}>
                      <span className={'detail-total-item-value'}>{monthTotal}</span>
                      <span>M</span>
                    </div>
                  </Col>
                  <Col flex={'240px'}>
                    <div style={{ height: 83 }}>
                      <Echarts options={monthOptions} />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={'iot-card-detail-total-item'}>
                <Row>
                  <Col flex={'auto'}>
                    <div className={'detail-total-item-name'}>本年流量消耗</div>
                    <div className={'detail-total-item-content'}>
                      <span className={'detail-total-item-value'}>{yearTotal}</span>
                      <span>M</span>
                    </div>
                  </Col>
                  <Col flex={'240px'}>
                    <div style={{ height: 84 }}>
                      <Echarts options={yearOptions} />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          {/*<Row gutter={24}>*/}
          {/*  <Col flex={'auto'}>*/}
          {/*    */}
          {/*  </Col>*/}
          {/*  <Col flex={'550px'}>*/}
          {/*    <Card>*/}
          {/*      */}
          {/*    </Card>*/}
          {/*  </Col>*/}
          {/*</Row>*/}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CardDetail;
