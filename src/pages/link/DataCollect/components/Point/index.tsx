import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { useDomFullHeight } from '@/hooks';
import service from '@/pages/link/DataCollect/service';
import CollectorCard from './CollectorCard/index';
import { Empty, PermissionButton } from '@/components';
import { Button, Card, Checkbox, Col, Dropdown, Menu, Pagination, Row } from 'antd';
import { model } from '@formily/reactive';
import ModbusSave from '@/pages/link/DataCollect/components/Point/Save/modbus';
import Scan from '@/pages/link/DataCollect/components/Point/Save/scan';
import { map } from 'rxjs/operators';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import OpcSave from '@/pages/link/DataCollect/components/Point/Save/opc-ua';
import WritePoint from '@/pages/link/DataCollect/components/Point/CollectorCard/WritePoint';
import BatchUpdate from './Save/BatchUpdate';
import { onlyMessage } from '@/utils/util';
import { DeleteOutlined, EditOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
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
  columns: ProColumns<PointItem>[];
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
  checkAll: boolean;
  currentPage: number;
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
  checkAll: false,
  currentPage: 0,
});

const PointCard = observer((props: PointCardProps) => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const { minHeight } = useDomFullHeight(`.data-collect-point`);
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
    if (subRef.current) {
      subRef.current?.unsubscribe();
    }
    PointModel.checkAll = false;
    PointModel.selectKey = [];
    PointModel.list = [];
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

  const onPageChange = (page: number, size: number) => {
    if (PointModel.currentPage === size) {
      handleSearch({
        ...param,
        pageIndex: page - 1,
        pageSize: size,
      });
    } else {
      PointModel.currentPage = size;
      handleSearch({
        ...param,
        pageIndex: 0,
        pageSize: size,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <PermissionButton
          isPermission={permission.update}
          icon={<EditOutlined />}
          onClick={() => {
            if (PointModel.list.length) {
              PointModel.batch_visible = true;
            } else {
              onlyMessage('请选择点位', 'error');
            }
          }}
          key="batch"
        >
          编辑
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="2">
        <PermissionButton
          key="delete"
          isPermission={permission.delete}
          icon={<DeleteOutlined />}
          popConfirm={{
            title: '确认删除?',
            onConfirm: async () => {
              const resp = await service.batchDeletePoint(PointModel.selectKey);
              if (resp.status === 200) {
                handleSearch(param);
                onlyMessage('操作成功！');
              }
            },
          }}
        >
          删除
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="3">
        <Button
          icon={<RedoOutlined />}
          onClick={() => {
            PointModel.selectKey = [];
            PointModel.list = [];
            PointModel.checkAll = false;
          }}
        >
          取消
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <SearchComponent<PointItem>
        field={props.columns}
        target="data-collect-point"
        onSearch={(data) => {
          const dt = {
            pageSize: 12,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card
        loading={loading}
        bordered={false}
        className={'data-collect-point'}
        style={{ position: 'relative', minHeight }}
        bodyStyle={{ paddingTop: !props.type ? 4 : 24 }}
      >
        <div>
          <div style={{ height: '100%', paddingBottom: 48 }}>
            {!props.type && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <PermissionButton
                  isPermission={permission.add}
                  style={{ marginRight: 10 }}
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
                  icon={<PlusOutlined />}
                >
                  {props?.provider === 'OPC_UA' ? '扫描' : '新增点位'}
                </PermissionButton>
                {props.provider === 'OPC_UA' && (
                  <Dropdown key={'more'} overlay={menu} placement="bottom">
                    <Button>批量操作</Button>
                  </Dropdown>
                )}
              </div>
            )}
            {dataSource?.data.length ? (
              <>
                {props.provider === 'OPC_UA' && (
                  <div style={{ margin: '20px 0' }}>
                    <Checkbox
                      checked={PointModel.checkAll}
                      onChange={(e) => {
                        PointModel.checkAll = e.target.checked;
                        if (e.target.checked) {
                          PointModel.selectKey = [...dataSource?.data.map((item: any) => item.id)];
                          PointModel.list = [...dataSource?.data];
                        } else {
                          PointModel.selectKey = [];
                          PointModel.list = [];
                        }
                      }}
                    >
                      全选
                    </Checkbox>
                  </div>
                )}
                <Row gutter={[24, 24]} style={{ marginTop: 10 }}>
                  {(dataSource?.data || []).map((record: any) => (
                    <Col
                      key={record.id}
                      xl={props.type ? 12 : 24}
                      xxl={12}
                      span={24}
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
                          if (PointModel.selectKey.length === dataSource.data.length) {
                            PointModel.checkAll = true;
                          } else {
                            PointModel.checkAll = false;
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
                    bottom: 10,
                    right: '2%',
                  }}
                >
                  <Pagination
                    showSizeChanger
                    size="small"
                    className={'pro-table-card-pagination'}
                    total={dataSource?.total || 0}
                    current={dataSource?.pageIndex + 1}
                    onChange={(page, size) => {
                      onPageChange(page, size);
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
  const columns: ProColumns<PointItem>[] = props.type
    ? [
        {
          title: '点位名称',
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
        // {
        //   title: '状态',
        //   dataIndex: 'state',
        //   valueType: 'select',
        //   valueEnum: {
        //     enabled: {
        //       text: '正常',
        //       status: 'enabled',
        //     },
        //     disabled: {
        //       text: '禁用',
        //       status: 'disabled',
        //     },
        //   },
        // },
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
          title: '点位名称',
          dataIndex: 'name',
        },
        {
          title: '访问类型',
          dataIndex: 'accessModes',
          valueType: 'select',
          valueEnum:
            props?.provider === 'MODBUS_TCP'
              ? {
                  read: {
                    text: '读',
                    status: 'read',
                  },
                  write: {
                    text: '写',
                    status: 'write',
                  },
                }
              : {
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
        // {
        //   title: '状态',
        //   dataIndex: 'state',
        //   valueType: 'select',
        //   valueEnum: {
        //     enabled: {
        //       text: '正常',
        //       status: 'enabled',
        //     },
        //     disabled: {
        //       text: '禁用',
        //       status: 'disabled',
        //     },
        //   },
        // },
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
  return (
    <div>
      <PointCard columns={columns} {...props} reload={PointModel.reload} />
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
