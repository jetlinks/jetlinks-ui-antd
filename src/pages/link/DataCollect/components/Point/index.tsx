import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { useDomFullHeight } from '@/hooks';
import service from '@/pages/link/DataCollect/service';
import CollectorCard from './CollectorCard/index';
import { Empty, PermissionButton } from '@/components';
import { Card, Col, Pagination, Row } from 'antd';
import { model } from '@formily/reactive';
import ModbusSave from '@/pages/link/DataCollect/components/Point/Save/modbus';
import Scan from '@/pages/link/DataCollect/components/Point/Save/scan';
import { map } from 'rxjs/operators';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import OpcSave from '@/pages/link/DataCollect/components/Point/Save/opc-ua';
import WritePoint from '@/pages/link/DataCollect/components/Point/CollectorCard/WritePoint';
import BatchUpdate from './Save/BatchUpdate';
import { onlyMessage } from '@/utils/util';
interface Props {
  type: boolean; // true: 综合查询  false: 数据采集
  data?: Partial<CollectorItem>;
  provider?: 'OPC_UA' | 'MODBUS_TCP';
}

interface PointCardProps {
  type: boolean; // true: 综合查询  false: 数据采集
  data?: Partial<CollectorItem>;
  provider?: 'OPC_UA' | 'MODBUS_TCP';
  reload: boolean; // 变化时刷新
}

const PointModel = model<{
  m_visible: boolean;
  p_visible: boolean;
  p_add_visible: boolean;
  writeVisible: boolean;
  current: Partial<PointItem>;
  reload: boolean;
  batch_visible: boolean;
  list: any[];
  selectKey: string[];
  arr: any[];
}>({
  m_visible: false,
  p_visible: false,
  p_add_visible: false,
  current: {},
  writeVisible: false,
  reload: false,
  batch_visible: false,
  list: [],
  selectKey: [],
  arr: [],
});

const PointCard = observer((props: PointCardProps) => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const { minHeight } = useDomFullHeight(`.data-collect-point`, 24);
  const [param, setParam] = useState({ pageSize: 12, terms: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const { permission } = PermissionButton.usePermission('link/DataCollect/DataGathering');
  const [propertyValue, setPropertyValue] = useState<any>({});
  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 12,
    pageIndex: 0,
    total: 0,
  });

  const getState = (record: Partial<ChannelItem>) => {
    if (record) {
      if (record?.state?.value === 'enabled') {
        return { ...record?.runningState };
      } else {
        return {
          text: '禁用',
          value: 'disabled',
        };
      }
    } else {
      return {};
    }
  };

  const columns: ProColumns<PointItem>[] = props.type
    ? [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '通讯协议',
          dataIndex: 'provider',
          valueType: 'select',
          valueEnum: {
            OPC_UA: {
              text: 'OPC_UA',
              status: 'OPC_UA',
            },
            MODBUS_TCP: {
              text: 'MODBUS_TCP',
              status: 'MODBUS_TCP',
            },
          },
        },
        {
          title: '访问类型',
          dataIndex: 'accessModes',
          valueType: 'select',
          valueEnum: {
            read: {
              text: '读',
              status: 'read',
            },
            write: {
              text: '写',
              status: 'write',
            },
            subscribe: {
              text: '订阅',
              status: 'subscribe',
            },
          },
        },
        {
          title: '状态',
          dataIndex: 'state',
          valueType: 'select',
          valueEnum: {
            enabled: {
              text: '正常',
              status: 'enabled',
            },
            disabled: {
              text: '禁用',
              status: 'disabled',
            },
          },
        },
        {
          title: '运行状态',
          dataIndex: 'runningState',
          valueType: 'select',
          valueEnum: {
            running: {
              text: '运行中',
              status: 'running',
            },
            partialError: {
              text: '部分错误',
              status: 'partialError',
            },
            failed: {
              text: '错误',
              status: 'failed',
            },
            stopped: {
              text: '已停止',
              status: 'stopped',
            },
          },
        },
        {
          title: '说明',
          dataIndex: 'description',
        },
      ]
    : [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '访问类型',
          dataIndex: 'accessModes',
          valueType: 'select',
          valueEnum: {
            read: {
              text: '读',
              status: 'read',
            },
            write: {
              text: '写',
              status: 'write',
            },
            subscribe: {
              text: '订阅',
              status: 'subscribe',
            },
          },
        },
        {
          title: '状态',
          dataIndex: 'state',
          valueType: 'select',
          valueEnum: {
            enabled: {
              text: '正常',
              status: 'enabled',
            },
            disabled: {
              text: '禁用',
              status: 'disabled',
            },
          },
        },
        {
          title: '运行状态',
          dataIndex: 'runningState',
          valueType: 'select',
          valueEnum: {
            running: {
              text: '运行中',
              status: 'running',
            },
            partialError: {
              text: '部分错误',
              status: 'partialError',
            },
            failed: {
              text: '错误',
              status: 'failed',
            },
            stopped: {
              text: '已停止',
              status: 'stopped',
            },
          },
        },
        {
          title: '说明',
          dataIndex: 'description',
        },
      ];

  const subRef = useRef<any>(null);

  const subscribeProperty = (list: any) => {
    const id = `collector-${props.data?.channelId || 'channel'}-${
      props.data?.id || 'point'
    }-data-${list.join('-')}`;
    const topic = `/collector/${props.data?.channelId || '*'}/${props.data?.id || '*'}/data`;
    subRef.current = subscribeTopic!(id, topic, {
      pointId: list.join(','),
    })
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        propertyValue[payload?.pointId] = { ...payload };
        setPropertyValue({ ...propertyValue });
      });
  };
  const handleSearch = (params: any) => {
    setLoading(true);
    setParam(params);
    service
      .queryPoint({
        ...params,
        terms: [
          ...params?.terms,
          {
            terms: [{ column: 'collectorId', value: props.data?.id }],
          },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
          subscribeProperty((resp.result?.data || []).map((item: any) => item.id));
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [props.data?.id, props.reload]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      subRef.current && subRef.current?.unsubscribe();
    };
  }, []);

  return (
    <div>
      <SearchComponent<PointItem>
        field={columns}
        target="data-collect-point"
        onSearch={(data) => {
          const dt = {
            pageSize: 12,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card loading={loading} bordered={false}>
        <div style={{ position: 'relative', minHeight }}>
          <div style={{ height: '100%', paddingBottom: 48 }}>
            {!props.type && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <PermissionButton
                  isPermission={permission.add}
                  onClick={async () => {
                    if (props.provider === 'OPC_UA') {
                      const resp = await service.queryPointNoPaging({ paging: false });
                      if (resp.status === 200) {
                        PointModel.p_add_visible = true;
                        PointModel.arr = resp.result;
                      }
                    } else {
                      PointModel.m_visible = true;
                    }
                    PointModel.current = {};
                  }}
                  key="button"
                  type="primary"
                >
                  {props?.provider === 'OPC_UA' ? '扫描' : '新增'}
                </PermissionButton>
                {props.provider === 'OPC_UA' && (
                  <PermissionButton
                    style={{ marginLeft: 15 }}
                    isPermission={permission.update}
                    onClick={() => {
                      if (PointModel.list.length) {
                        PointModel.batch_visible = true;
                      } else {
                        onlyMessage('请选择点位', 'error');
                      }
                    }}
                    key="batch"
                  >
                    批量编辑
                  </PermissionButton>
                )}
              </div>
            )}
            {dataSource?.data.length ? (
              <>
                <Row gutter={[18, 18]} style={{ marginTop: 10 }}>
                  {(dataSource?.data || []).map((record: any) => (
                    <Col
                      key={record.id}
                      span={12}
                      onClick={() => {
                        if (props?.provider === 'OPC_UA') {
                          if (PointModel.selectKey.includes(record.id)) {
                            PointModel.selectKey = PointModel.selectKey.filter(
                              (i) => i !== record.id,
                            );
                            PointModel.list = PointModel.list.filter((i) => i.id !== record.id);
                          } else {
                            PointModel.selectKey.push(record.id);
                            PointModel.list.push(record);
                          }
                        }
                      }}
                    >
                      <CollectorCard
                        item={{ ...record, status: getState(record) }}
                        wsValue={propertyValue[record.id]}
                        reload={() => {
                          handleSearch(param);
                        }}
                        activeStyle={PointModel.selectKey.includes(record.id) ? 'active' : ''}
                        update={(item, flag) => {
                          if (flag) {
                            PointModel.writeVisible = true;
                          } else {
                            if (item.provider === 'MODBUS_TCP') {
                              PointModel.m_visible = true;
                            } else {
                              PointModel.p_visible = true;
                            }
                          }
                          PointModel.current = item;
                        }}
                      />
                    </Col>
                  ))}
                </Row>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                  }}
                >
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
                    pageSizeOptions={[12, 24, 48, 96]}
                    pageSize={dataSource?.pageSize}
                    showTotal={(num) => {
                      const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                      const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                      return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={{ height: minHeight - 150 }}>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

export default observer((props: Props) => {
  return (
    <div>
      <PointCard {...props} reload={PointModel.reload} />
      {PointModel.m_visible && (
        <ModbusSave
          data={PointModel.current}
          collector={props?.data || {}}
          close={() => {
            PointModel.m_visible = false;
          }}
          reload={() => {
            PointModel.m_visible = false;
            PointModel.reload = !PointModel.reload;
          }}
        />
      )}
      {PointModel.p_visible && (
        <OpcSave
          close={() => {
            PointModel.p_visible = false;
          }}
          reload={() => {
            PointModel.p_visible = false;
            PointModel.reload = !PointModel.reload;
          }}
          data={PointModel.current}
        />
      )}
      {PointModel.p_add_visible && (
        <Scan
          close={() => {
            PointModel.p_add_visible = false;
          }}
          data={PointModel.arr}
          collector={props.data}
          reload={() => {
            PointModel.p_add_visible = false;
            PointModel.reload = !PointModel.reload;
          }}
        />
      )}
      {PointModel.writeVisible && (
        <WritePoint
          data={PointModel.current}
          onCancel={() => {
            PointModel.writeVisible = false;
          }}
        />
      )}
      {PointModel.batch_visible && (
        <BatchUpdate
          close={() => {
            PointModel.batch_visible = false;
          }}
          data={PointModel.list}
          reload={() => {
            PointModel.batch_visible = false;
            PointModel.reload = !PointModel.reload;
            PointModel.list = [];
            PointModel.selectKey = [];
          }}
        />
      )}
    </div>
  );
});
