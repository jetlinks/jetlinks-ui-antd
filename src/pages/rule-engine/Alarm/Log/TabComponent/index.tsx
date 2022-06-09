import SearchComponent from '@/components/SearchComponent';
import { FileFilled, FileTextFilled, ToolFilled } from '@ant-design/icons';
import type { ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, Card, Col, Empty, Pagination, Row, Tooltip } from 'antd';
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
import classNames from 'classnames';

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
      dataIndex: 'alarmName',
    },
    {
      title: '最近告警时间',
      dataIndex: 'alarmTime',
      valueType: 'dateTime',
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
    const terms = [...params.terms];
    if (props.type !== 'all') {
      terms.push({
        termType: 'eq',
        column: 'targetType',
        value: props.type,
        type: 'and',
      });
    }
    service
      .query({
        ...params,
        terms: [...terms],
        sorts: [{ name: 'alarmTime', order: 'desc' }],
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

  const tools = (record: any) => [
    <Button
      type={'link'}
      key={'solve'}
      style={{ padding: 0 }}
      disabled={record.state.value === 'normal'}
      onClick={() => {
        AlarmLogModel.solveVisible = true;
        AlarmLogModel.current = record;
      }}
    >
      <Tooltip title={record.state?.value === 'normal' ? '无告警' : ''}>
        <ToolFilled />
        告警处理
      </Tooltip>
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      key={'log'}
      onClick={() => {
        AlarmLogModel.current = record;
        const url = getMenuPathByParams(MENUS_CODE['rule-engine/Alarm/Log/Detail'], record.id);
        history.push(url);
      }}
    >
      <FileFilled />
      告警日志
    </Button>,
    <Button
      type={'link'}
      style={{ padding: 0 }}
      key={'detail'}
      onClick={() => {
        AlarmLogModel.logVisible = true;
        AlarmLogModel.current = record;
      }}
    >
      <FileTextFilled />
      处理记录
    </Button>,
  ];

  const getAction = (actions: React.ReactNode[]) => {
    return actions
      .filter((item) => item)
      .map((item: any) => {
        return (
          <div
            className={classNames('card-button', {
              disabled: item.disabled,
            })}
            key={item.key}
          >
            {item}
          </div>
        );
      });
  };

  const defaultImage = require('/public/images/device-access.png');

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
          <Row gutter={[24, 24]} style={{ marginTop: 10 }}>
            {(dataSource?.data || []).map((item: any) => (
              <Col key={item.id} span={12}>
                <div className={classNames('iot-card')}>
                  <div className={'card-warp'}>
                    <div className={classNames('card-content')}>
                      <div
                        style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}
                        className="ellipsis"
                      >
                        <Tooltip title={item.alarmName}>
                          <a>{item.alarmName}</a>
                        </Tooltip>
                      </div>
                      <div className="alarm-log-context">
                        <div className="context-left">
                          <div className="context-img">
                            <img width={70} height={70} src={defaultImage} alt={''} />
                          </div>
                          <div className="left-item">
                            <div className="left-item-title">{titleMap.get(item.targetType)}</div>
                            <div className="left-item-value ellipsis">
                              <Tooltip placement="topLeft" title={item.targetName}>
                                {item.targetName}
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div className="context-right">
                          <div className="right-item">
                            <div className="right-item-title">最近告警时间</div>
                            <div className="right-item-value ellipsis">
                              {moment(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                          </div>
                          <div className="right-item">
                            <div className="right-item-title">状态</div>
                            <div className="right-item-value">
                              <Badge
                                status={item.state.value === 'warning' ? 'error' : 'default'}
                              />
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
                      <div
                        className={'alarm-log-state'}
                        style={{ backgroundColor: colorMap.get(item.level) }}
                      >
                        <div className={'card-state-content'}>
                          {AlarmLogModel.defaultLevel.find((i) => i.level === item.level)?.title ||
                            item.level}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'card-tools'}>{getAction(tools(item))}</div>
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
