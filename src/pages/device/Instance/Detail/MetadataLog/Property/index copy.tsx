import { InstanceModel, service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import { DatePicker, Modal, Radio, Select, Space, Table, Tabs, Tooltip as ATooltip } from 'antd';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import encodeQuery from '@/utils/encodeQuery';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Axis, Chart, LineAdvance, Legend, Slider, Tooltip, Point } from 'bizcharts';
import FileComponent from '../../Running/Property/FileComponent';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import Detail from './Detail';
import AMap from './AMap';
interface Props {
  close: () => void;
  data: Partial<PropertyMetadata>;
}

const PropertyLog = (props: Props) => {
  const params = useParams<{ id: string }>();
  const { close, data } = props;
  const list = ['int', 'float', 'double', 'long'];
  const [dataSource, setDataSource] = useState<any>({});
  const [start, setStart] = useState<number>(moment().startOf('day').valueOf());
  const [end, setEnd] = useState<number>(new Date().getTime());
  const [radioValue, setRadioValue] = useState<undefined | 'today' | 'week' | 'month'>('today');
  const [dateValue, setDateValue] = useState<any>(undefined);
  const [chartsList, setChartsList] = useState<any>([]);
  const [cycle, setCycle] = useState<string>(
    list.includes(data.valueType?.type || '') ? '*' : '1m',
  );
  const [agg, setAgg] = useState<string>('AVG');
  const [tab, setTab] = useState<string>('table');
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>('');

  const [geoList, setGeoList] = useState<any>({});

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      ellipsis: true,
      render: (text: any) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: <span>{data.valueType?.type !== 'file' ? '自定义属性' : '文件内容'}</span>,
      dataIndex: 'value',
      key: 'value',
      ellipsis: true,
      render: (text: any, record: any) => (
        <FileComponent type="table" value={{ formatValue: record.value }} data={data} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => (
        <a>
          {data.valueType?.type === 'file' && data?.valueType?.fileType == 'url' ? (
            <ATooltip title="下载">
              <DownloadOutlined
                onClick={() => {
                  const type = (record?.value || '').split('.').pop();
                  const downloadUrl = record.value;
                  const downNode = document.createElement('a');
                  downNode.href = downloadUrl;
                  downNode.target = '_blank';
                  downNode.download = `${InstanceModel.detail.name}-${data.name}${moment(
                    new Date().getTime(),
                  ).format('YYYY-MM-DD-HH-mm-ss')}.${type}`;
                  downNode.style.display = 'none';
                  document.body.appendChild(downNode);
                  downNode.click();
                  document.body.removeChild(downNode);
                }}
              />
            </ATooltip>
          ) : (
            <SearchOutlined
              onClick={() => {
                setDetailVisible(true);
                setCurrent(record.value);
              }}
            />
          )}
        </a>
      ),
    },
  ];

  const geoColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: any) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
    },
    {
      title: '位置',
      dataIndex: 'value',
      key: 'value',
      render: (text: any, record: any) => (
        <FileComponent type="table" value={{ formatValue: record.value }} data={data} />
      ),
    },
  ];

  const tabList = [
    {
      tab: '列表',
      key: 'table',
    },
    {
      tab: '图表',
      key: 'charts',
    },
  ];

  const handleSearch = (param: any, startTime?: number, endTime?: number) => {
    service
      .getPropertyData(
        params.id,
        encodeQuery({
          ...param,
          terms: {
            property: data.id,
            timestamp$BTW: startTime && endTime ? [startTime, endTime] : [],
          },
          sorts: { timestamp: 'desc' },
        }),
      )
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  const queryChartsList = async (startTime?: number, endTime?: number) => {
    const resp = await service.queryPropertieList(params.id, data.id || '', {
      paging: false,
      terms: [
        {
          column: 'timestamp$BTW',
          value: startTime && endTime ? [startTime, endTime] : [],
          type: 'and',
        },
      ],
      sorts: [{ name: 'timestamp', order: 'asc' }],
    });
    if (resp.status === 200) {
      const dataList: any[] = [];
      resp.result.data.forEach((i: any) => {
        dataList.push({
          year: moment(i.timestamp).format('YYYY-MM-DD HH:mm:ss'),
          value: i.value,
          type: data?.name || '',
        });
      });
      setChartsList(dataList);
    }
  };

  const queryChartsAggList = async (datas: any) => {
    const resp = await service.queryPropertieInfo(params.id, datas);
    if (resp.status === 200) {
      const dataList: any[] = [];
      resp.result.forEach((i: any) => {
        dataList.push({
          ...i,
          year: moment(i.time).format('YYYY-MM-DD HH:mm:ss'),
          value: Number(i[data.id || '']),
          type: data?.name || '',
        });
      });
      setChartsList(dataList.reverse());
    }
  };

  useEffect(() => {
    setRadioValue('today');
    setTab('table');
    setStart(moment().startOf('day').valueOf());
    setEnd(new Date().getTime());
  }, []);

  const scale = {
    value: { min: 0 },
    year: {
      type: 'time',
      mask: 'YYYY-MM-DD HH:mm:ss',
      // max: end,
      // min: start,
    },
  };

  const renderComponent = (type: string) => {
    switch (type) {
      case 'table':
        return (
          <Table
            size="small"
            rowKey={'id'}
            onChange={(page) => {
              handleSearch(
                {
                  pageSize: page.pageSize,
                  pageIndex: Number(page.current) - 1 || 0,
                },
                start,
                end,
              );
            }}
            dataSource={dataSource?.data || []}
            columns={data?.valueType?.type === 'geoPoint' ? geoColumns : columns}
            pagination={{
              current: (dataSource?.pageIndex || 0) + 1,
              pageSize: dataSource?.pageSize || 10,
              showSizeChanger: true,
              total: dataSource?.total || 0,
            }}
          />
        );
      case 'charts':
        return (
          <div>
            <div style={{ margin: '10 0', display: 'flex' }}>
              <div style={{ marginRight: 20 }}>
                统计周期：
                <Select
                  value={cycle}
                  style={{ width: 120 }}
                  onChange={(value: string) => {
                    setCycle(value);
                    if (value === '*') {
                      queryChartsList(start, end);
                    } else {
                      queryChartsAggList({
                        columns: [
                          {
                            property: data.id,
                            alias: data.id,
                            agg: agg,
                          },
                        ],
                        query: {
                          interval: value,
                          format: 'yyyy-MM-dd HH:mm:ss',
                          from: start,
                          to: end,
                        },
                      });
                    }
                  }}
                >
                  {list.includes(data.valueType?.type || '') && (
                    <Select.Option value="*">实际值</Select.Option>
                  )}
                  <Select.Option value="1m">按分钟统计</Select.Option>
                  <Select.Option value="1h">按小时统计</Select.Option>
                  <Select.Option value="1d">按天统计</Select.Option>
                  <Select.Option value="1w">按周统计</Select.Option>
                  <Select.Option value="1M">按月统计</Select.Option>
                </Select>
              </div>
              {cycle !== '*' && list.includes(data.valueType?.type || '') && (
                <div>
                  统计规则：
                  <Select
                    defaultValue="AVG"
                    style={{ width: 120 }}
                    onChange={(value: string) => {
                      setAgg(value);
                      queryChartsAggList({
                        columns: [
                          {
                            property: data.id,
                            alias: data.id,
                            agg: value,
                          },
                        ],
                        query: {
                          interval: cycle,
                          format: 'yyyy-MM-dd HH:mm:ss',
                          from: start,
                          to: end,
                        },
                      });
                    }}
                  >
                    <Select.Option value="AVG">平均值</Select.Option>
                    <Select.Option value="MAX">最大值</Select.Option>
                    <Select.Option value="MIN">最小值</Select.Option>
                    <Select.Option value="COUNT">总数</Select.Option>
                  </Select>
                </div>
              )}
            </div>
            <div style={{ marginTop: 10 }}>
              <Chart height={400} data={chartsList} scale={scale} padding="auto" autoFit>
                <Legend />
                <Axis name="year" />
                <Axis
                  name="value"
                  label={{
                    formatter: (val) => parseFloat(val).toLocaleString(),
                  }}
                />
                <Tooltip shared />
                <Point position="year*value" />
                <LineAdvance position="year*value" shape="smooth" area />
                <Slider />
              </Chart>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (tab === 'table') {
      handleSearch(
        {
          pageSize: 10,
          pageIndex: 0,
        },
        start,
        end,
      );
    } else if (tab === 'charts') {
      if (list.includes(data.valueType?.type || '')) {
        queryChartsList(start, end);
      } else {
        queryChartsAggList({
          columns: [
            {
              property: data.id,
              alias: data.id,
              agg,
            },
          ],
          query: {
            interval: cycle,
            format: 'yyyy-MM-dd HH:mm:ss',
            from: start,
            to: end,
          },
        });
      }
    } else if (tab === 'geo') {
      service
        .getPropertyData(
          params.id,
          encodeQuery({
            paging: false,
            terms: { property: data?.id, timestamp$BTW: start && start ? [start, end] : [] },
            sorts: { timestamp: 'asc' },
          }),
        )
        .then((resp) => {
          if (resp.status === 200) {
            setGeoList(resp.result);
          }
        });
    }
    setDateValue([moment(start), moment(end)]);
  }, [start, end]);

  // @ts-ignore
  return (
    <Modal
      maskClosable={false}
      title="详情"
      visible
      onCancel={() => close()}
      onOk={() => close()}
      width="50vw"
    >
      <div style={{ marginBottom: '20px' }}>
        <Space>
          <Radio.Group
            value={radioValue}
            buttonStyle="solid"
            onChange={(e) => {
              const value = e.target.value;
              setRadioValue(value);
              let st: number = 0;
              const et = new Date().getTime();
              if (value === 'today') {
                st = moment().startOf('day').valueOf();
              } else if (value === 'week') {
                st = moment().subtract(6, 'days').valueOf();
              } else if (value === 'month') {
                st = moment().subtract(29, 'days').valueOf();
              }
              setDateValue(undefined);
              setStart(st);
              setEnd(et);
            }}
            style={{ minWidth: 220 }}
          >
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="week">近一周</Radio.Button>
            <Radio.Button value="month">近一月</Radio.Button>
          </Radio.Group>
          {
            // @ts-ignore
            <DatePicker.RangePicker
              value={dateValue}
              showTime
              onChange={(dates: any) => {
                if (dates) {
                  setRadioValue(undefined);
                  setDateValue(dates);
                  const st = dates[0]?.valueOf();
                  const et = dates[1]?.valueOf();
                  setStart(st);
                  setEnd(et);
                }
              }}
            />
          }
        </Space>
      </div>
      <Tabs
        activeKey={tab}
        onChange={(key: string) => {
          setTab(key);
          if (key === 'charts' && !!data.valueType?.type) {
            if (list.includes(data.valueType?.type)) {
              queryChartsList(start, end);
            } else {
              setCycle('1m');
              setAgg('COUNT');
              queryChartsAggList({
                columns: [
                  {
                    property: data.id,
                    alias: data.id,
                    agg: 'COUNT',
                  },
                ],
                query: {
                  interval: '1m',
                  format: 'yyyy-MM-dd HH:mm:ss',
                  from: start,
                  to: end,
                },
              });
            }
          }
          if (key === 'geo') {
            service
              .getPropertyData(
                params.id,
                encodeQuery({
                  paging: false,
                  terms: { property: data.id, timestamp$BTW: start && end ? [start, end] : [] },
                  sorts: { timestamp: 'asc' },
                }),
              )
              .then((resp) => {
                if (resp.status === 200) {
                  setGeoList(resp.result);
                }
              });
          }
          if (key === 'table') {
            handleSearch(
              {
                pageSize: 10,
                pageIndex: 0,
              },
              start,
              end,
            );
          }
        }}
      >
        {tabList.map((item) => (
          <Tabs.TabPane tab={item.tab} key={item.key}>
            {renderComponent(item.key)}
          </Tabs.TabPane>
        ))}
        {data?.valueType?.type === 'geoPoint' && (
          <Tabs.TabPane tab="轨迹" key="geo">
            <AMap value={geoList} name={data?.name || ''} />
          </Tabs.TabPane>
        )}
      </Tabs>
      {detailVisible && (
        <Detail
          close={() => {
            setDetailVisible(false);
          }}
          value={current}
          type={data.valueType?.type || ''}
        />
      )}
    </Modal>
  );
};
export default PropertyLog;
