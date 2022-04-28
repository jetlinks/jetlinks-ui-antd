import SearchComponent from '@/components/SearchComponent';
import { FileFilled, FileTextFilled, ToolFilled } from '@ant-design/icons';
import type { ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, Card, Col, Empty, Pagination, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import SolveComponent from '../SolveComponent';
import SolveLog from '../SolveLog';
import { AlarmLogModel } from '../model';
import moment from 'moment';
import { observer } from '@formily/reactive-react';
import { service } from '@/pages/rule-engine/Alarm/Log';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

interface Props {
  type: string;
}

const imgMap = new Map();
imgMap.set('product', require('/public/images/alarm/product.png'));
imgMap.set('device', require('/public/images/alarm/device.png'));
imgMap.set('other', require('/public/images/alarm/other.png'));
imgMap.set('org', require('/public/images/alarm/org.png'));

const titleMap = new Map();
titleMap.set('product', '产品');
titleMap.set('device', '设备');
titleMap.set('other', '其他');
titleMap.set('org', '部门');

const colorMap = new Map();
colorMap.set(1, '#E50012');
colorMap.set(2, '#FF9457');
colorMap.set(3, '#FABD47');
colorMap.set(4, '#999999');
colorMap.set(5, '#C4C4C4');

const TabComponent = observer((props: Props) => {
  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '级别',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '级别一',
          status: '1',
        },
        2: {
          text: '级别二',
          status: '2',
        },
        3: {
          text: '级别三',
          status: '3',
        },
        4: {
          text: '级别四',
          status: '4',
        },
        5: {
          text: '级别五',
          status: '5',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        warning: {
          text: '告警中',
          status: 'warning',
        },
        normal: {
          text: '无告警',
          status: 'normal',
        },
      },
    },
  ];

  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });
  const history = useHistory<Record<string, string>>();

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const handleSearch = (params: any) => {
    setParam(params);
    service
      .query({
        ...params,
        terms: [
          ...params.terms,
          {
            termType: 'eq',
            column: 'targetType',
            value: props.type,
            type: 'and',
          },
        ],
        sorts: [{ name: 'alarmDate', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [props.type]);

  return (
    <div className="alarm-log-card">
      <SearchComponent<any>
        field={columns}
        target="alarm-log"
        onSearch={(data) => {
          const dt = {
            pageSize: 10,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card>
        {dataSource?.data.length > 0 ? (
          <Row gutter={24} style={{ marginTop: 10 }}>
            {(dataSource?.data || []).map((item: any) => (
              <Col key={item.id} span={24}>
                <div className="alarm-log-item">
                  <div className="alarm-log-title">
                    <div
                      className="alarm-log-level"
                      style={{ backgroundColor: colorMap.get(item.level) }}
                    >
                      <div className="alarm-log-text">
                        {AlarmLogModel.defaultLevel.find((i) => i.level === item.level)?.title ||
                          item.level}
                      </div>
                    </div>
                    <div className="alarm-log-title-text">{item.alarmName}</div>
                  </div>
                  <div className="alarm-log-content">
                    <div className="alarm-log-image">
                      <img
                        width={88}
                        height={88}
                        src={imgMap.get(props.type)}
                        alt={''}
                        style={{ marginRight: 20 }}
                      />
                      <div className="alarm-type">
                        <div className="name">{titleMap.get(item.targetType)}</div>
                        <div className="text">{item.targetName}</div>
                      </div>
                      <div className="alarm-log-right">
                        <div className="alarm-log-time">
                          <div className="log-title">最近告警时间</div>
                          <div className="context">
                            {moment(item.alarmDate).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        </div>
                        <div className="alarm-log-time" style={{ paddingLeft: 10 }}>
                          <div className="log-title">状态</div>
                          <div className="context">
                            <Badge status={item.state.value === 'warning' ? 'error' : 'default'} />
                            <span
                              style={{
                                color: item.state.value === 'warning' ? '#E50012' : 'black',
                              }}
                            >
                              {item.state.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="alarm-log-actions">
                      <Space>
                        {item.state.value === 'warning' && (
                          <div className="alarm-log-action">
                            <Button
                              type={'link'}
                              onClick={() => {
                                AlarmLogModel.solveVisible = true;
                                AlarmLogModel.current = item;
                              }}
                            >
                              <div className="btn">
                                <ToolFilled className="icon" />
                                <div>告警处理</div>
                                {/* action */}
                              </div>
                            </Button>
                          </div>
                        )}
                        <div className="alarm-log-action">
                          <Button
                            type={'link'}
                            onClick={() => {
                              AlarmLogModel.current = item;
                              const url = getMenuPathByParams(
                                MENUS_CODE['rule-engine/Alarm/Log/Detail'],
                                item.id,
                              );
                              history.push(url);
                            }}
                          >
                            <div className="btn">
                              <FileFilled className="icon" />
                              <div>告警日志</div>
                            </div>
                          </Button>
                        </div>
                        <div className="alarm-log-action">
                          <Button
                            type={'link'}
                            onClick={() => {
                              AlarmLogModel.logVisible = true;
                              AlarmLogModel.current = item;
                            }}
                          >
                            <div className="btn">
                              <FileTextFilled className="icon" />
                              <div>处理记录</div>
                            </div>
                          </Button>
                        </div>
                      </Space>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty />
        )}
        {dataSource.data.length > 0 && (
          <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
            <Pagination
              showSizeChanger
              size="small"
              className={'pro-table-card-pagination'}
              total={dataSource?.total || 0}
              current={dataSource?.pageIndex + 1}
              onChange={(page, size) => {
                handleSearch({
                  ...param,
                  pageIndex: page - 1,
                  pageSize: size,
                });
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              pageSize={dataSource?.pageSize}
              showTotal={(num) => {
                const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
              }}
            />
          </div>
        )}
      </Card>
      {AlarmLogModel.solveVisible && (
        <SolveComponent
          close={() => {
            AlarmLogModel.solveVisible = false;
            AlarmLogModel.current = {};
          }}
          reload={() => {
            AlarmLogModel.solveVisible = false;
            AlarmLogModel.current = {};
            handleSearch(param);
          }}
          data={AlarmLogModel.current}
        />
      )}
      {AlarmLogModel.logVisible && (
        <SolveLog
          close={() => {
            AlarmLogModel.logVisible = false;
            AlarmLogModel.current = {};
          }}
          data={AlarmLogModel.current}
        />
      )}
    </div>
  );
});

export default TabComponent;
