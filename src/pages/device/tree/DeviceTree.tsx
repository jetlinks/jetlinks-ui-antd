import encodeQueryParam from '@/utils/encodeParam';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from 'antd';
import React, { Fragment, useEffect, useReducer, useRef, useState } from 'react';
import ChoiceDevice from '../group/save/bind/ChoiceDevice';
import { GroupItem } from './data';
import Save from './save';
import Service from './service';
import DeviceInfo from '@/pages/device/instance/editor/index';
import { router } from 'umi';
import ProTable from '@/pages/system/permission/component/ProTable';
interface Props {
  location: any;
}
interface State {
  data: any[];
  deviceData: any;
  saveVisible: boolean;
  bindVisible: boolean;
  detailVisible: boolean;
  current: Partial<GroupItem>;
  parentId: string | null;
  deviceIds: string[];
  device: any;
}
const DeviceTree: React.FC<Props> = props => {
  const {
    location: { query },
  } = props;

  const initialState: State = {
    data: [],
    deviceData: {},
    saveVisible: false,
    bindVisible: false,
    detailVisible: false,
    current: {},
    parentId: query.id,
    deviceIds: [],
    device: {},
  };
  const reducer = (state: State, action: any) => {
    switch (action.type) {
      case 'operation':
        return { ...state, ...action.payload };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [add, setAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deviceLoading, setDeviceLoading] = useState<boolean>(true);
  const {
    data,
    deviceData,
    saveVisible,
    bindVisible,
    detailVisible,
    current,
    parentId,
    deviceIds,
    device,
  } = state;
  const service = new Service('device');
  const [searchParam, setSearchParam] = useState({
    pageSize: 10,
    sorts: {
      order: 'descend',
      field: 'alarmTime',
    },
  });
  const [searchValue, setSearchValue] = useState('');
  const search = (param?: any) => {
    setDeviceLoading(true);
    const defaultTerms = {
      terms: {
        id: query.id,
      },
      paging: false,
    };

    service
      .groupTree(
        encodeQueryParam({
          ...defaultTerms,
          terms: { ...defaultTerms.terms, ...param?.terms },
        }),
      )
      .subscribe(
        resp => {
          dispatch({
            type: 'operation',
            payload: {
              data: resp,
            },
          });
          searchDevice(resp[0], searchParam);
          dispatch({
            type: 'operation',
            payload: {
              current: resp[0],
              parentId: resp[0].id,
            },
          });
        },
        () => { },
        () => {
          setLoading(true);
        },
      );
  };
  useEffect(() => {
    search();
  }, []);
  const saveGroup = (item: GroupItem) => {
    if (add) {
      service.saveGroup({ ...item, parentId }).subscribe(
        () => message.success('添加成功'),
        () => { },
        () => {
          dispatch({ type: 'operation', payload: { saveVisible: false, parentId: null } });
          search();
        },
      );
    } else {
      service.saveOrUpdataGroup(item).subscribe(
        () => message.success('添加成功'),
        () => { },
        () => {
          dispatch({ type: 'operation', payload: { saveVisible: false, parentId: null } });
          search();
        },
      );
    }
  };

  const searchDevice = (item: GroupItem | any, params?: any) => {
    service
      .groupDevice(
        encodeQueryParam({
          pageSize: 10,
          ...params,
          terms: {
            'id$dev-group': item.id,
            name$LIKE: item.searchValue,
          },
        }),
      )
      .subscribe(
        resp => {
          dispatch({
            type: 'operation',
            payload: {
              deviceData: resp,
              // deviceIds: resp.data.map((item: any) => item.id),
            },
          });
        },
        () => { },
        () => {
          setDeviceLoading(false);
        },
      );
  };
  const bindDevice = () => {
    if (deviceIds.length > 0) {
      service.bindDevice(parentId!, deviceIds).subscribe(
        () => message.success('绑定成功'),
        () => message.error('绑定失败'),
        () => {
          dispatch({
            type: 'operation',
            payload: {
              bindVisible: false,
              deviceIds: []
            },
          });
          searchDevice({ id: parentId });
        },
      );
    } else {
      message.error('未选择需要绑定的设备')
    }
  };
  const unbindDevice = (deviceId: string[]) => {
    service.unbindDevice(parentId!, deviceId).subscribe(
      () => message.success('解绑成功'),
      () => message.error('解绑失败'),
      () => {
        dispatch({
          type: 'operation',
          payload: {
            bindVisible: false,
          },
        });
        searchDevice({ id: parentId });
      },
    );
  };

  const unbindAll = () => {
    if (selectedRowKeys.length > 0) {
      service.unbind(parentId!, selectedRowKeys).subscribe(
        () => message.success('解绑成功'),
        () => message.error('解绑失败'),
        () => {
          dispatch({
            type: 'operation',
            payload: {
              bindVisible: false,
            },
          });
          searchDevice({ id: parentId });
          setSelectedRowKeys([]);
        },
      );
    } else {
      service.unbindAll(parentId!).subscribe(
        () => message.success('解绑成功'),
        () => message.error('解绑失败'),
        () => {
          dispatch({
            type: 'operation',
            payload: {
              bindVisible: false,
            },
          });
          searchDevice({ id: parentId });
        },
      );
    }
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[] | any[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <PageHeaderWrapper
      onBack={() => router.push('/device/tree')}
      title={<>{data[0] ? data[0].name : null}</>}
    >
      {loading && (
        <Card>
          <Row gutter={24}>
            <Col span={8}>
              <Table
                title={() => (
                  <>
                    分组
                    <span style={{ marginLeft: 20, marginRight: 10 }}>
                      <Input.Search
                        style={{ width: '60%' }}
                        placeholder="请输入输入名称"
                        // onChange={() => search()}
                        onSearch={value => {
                          if (value) {
                            const tempData = data.filter(
                              (item: any) => item.name.indexOf(value) > -1,
                            );
                            dispatch({ type: 'operation', payload: { data: tempData } });
                          } else {
                            search();
                          }
                        }}
                      />
                    </span>
                    <Button
                      type="primary"
                      onClick={() => {
                        setAdd(true);
                        dispatch({
                          type: 'operation',
                          payload: {
                            saveVisible: true,
                            parentId: query.id,
                            // current:null,
                          },
                        });
                      }}
                    >
                      新增
                    </Button>
                  </>
                )}
                onRow={item => {
                  return {
                    onClick: () => {
                      searchDevice(item, searchParam);
                      setDeviceLoading(true);
                      dispatch({
                        type: 'operation',
                        payload: { current: item, parentId: item.id },
                      });
                    },
                  };
                }}
                bordered={false}
                pagination={false}
                dataSource={data}
                size="small"
                defaultExpandedRowKeys={data[0] && [data[0].id]}
                rowKey={(item: any) => item.id}
                columns={[
                  {
                    title: '序号',
                    dataIndex: 'id',
                    // width:200,
                    ellipsis: true,
                    render: (record) => (
                      <Tooltip title={record}>
                        <span>{record}</span>
                      </Tooltip>
                    )
                  },
                  { title: '名称', dataIndex: 'name', ellipsis: true },
                  {
                    title: '操作',
                    width: 100,
                    align: 'center',
                    render: (_, record) => (
                      <Fragment>
                        <Icon
                          type="edit"
                          onClick={() => {
                            setAdd(false);
                            dispatch({
                              type: 'operation',
                              payload: {
                                current: record,
                                saveVisible: true,
                              },
                            });
                          }}
                        />
                        {
                          record.level < 6 &&
                          <>
                            <Divider type="vertical" />
                            <Tooltip title="新增子分组">
                              <Icon
                                type="plus"
                                onClick={() => {
                                  setAdd(true);
                                  dispatch({
                                    type: 'operation',
                                    payload: {
                                      parentId: record.id,
                                      saveVisible: true,
                                    },
                                  });
                                }}
                              />
                            </Tooltip>
                          </>
                        }
                        <Divider type="vertical" />
                        <Tooltip title="删除">
                          <Popconfirm
                            title="确认删除分组？"
                            onConfirm={() => {
                              service.removeGroup(record.id).subscribe(
                                () => message.success('删除成功!'),
                                () => message.error('删除失败'),
                                () => search(),
                              );
                            }}
                          >
                            <Icon type="close" />
                          </Popconfirm>
                        </Tooltip>
                        {/* <Divider type="vertical" />
                                                <Tooltip title="绑定设备">
                                                    <Icon type="apartment" onClick={() => {
                                                        dispatch({
                                                            type: 'operation',
                                                            payload: {
                                                                bindVisible: true,
                                                                parentId: record.id
                                                            }
                                                        })
                                                    }} />
                                                </Tooltip> */}
                      </Fragment>
                    ),
                  },
                ]}
              />
            </Col>
            <Col span={16}>
              <ProTable
                loading={deviceLoading}
                title={() => (
                  <Fragment>
                    {current.name}
                    <span style={{ marginLeft: 20 }}>
                      <Input.Search
                        style={{ width: '30%' }}
                        placeholder="输入名称后自动查询"
                        onSearch={value => {
                          setSearchValue(value);
                          searchDevice({
                            id: parentId,
                            searchValue: value,
                          })
                        }}
                      />
                    </span>

                    <Popconfirm title="确认解绑？" onConfirm={() => unbindAll()}>
                      <Button style={{ marginLeft: 10 }} type="danger">
                        解绑{selectedRowKeys.length > 0 ? `${selectedRowKeys.length}项` : '全部'}
                      </Button>
                    </Popconfirm>
                    <Button
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        dispatch({
                          type: 'operation',
                          payload: {
                            bindVisible: true,
                            parentId: parentId,
                          },
                        });
                      }}
                    >
                      绑定设备
                    </Button>
                  </Fragment>
                )}
                dataSource={deviceData?.data}
                paginationConfig={deviceData}
                size="small"
                rowKey="id"
                rowSelection={rowSelection}
                onSearch={(params: any) => {
                  searchDevice({ id: parentId, searchValue: searchValue }, params);
                }}
                columns={[
                  { title: 'ID', dataIndex: 'id' },
                  { title: '名称', dataIndex: 'name' },
                  { title: '产品名称', dataIndex: 'productName' },
                  { title: '状态', dataIndex: 'state', render: (text: any) => text.text },
                  {
                    title: '操作',
                    render: (_: any, record: any) => (
                      <Fragment>
                        <a
                          onClick={() => {
                            dispatch({
                              type: 'operation',
                              payload: {
                                device: record,
                                detailVisible: true,
                              },
                            });
                          }}
                        >
                          详情
                        </a>

                        <Divider type="vertical" />
                        <a
                          onClick={() => {
                            unbindDevice([record.id]);
                          }}
                        >
                          解绑
                        </a>
                      </Fragment>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>
      )}
      {saveVisible && (
        <Save
          data={current}
          flag={add}
          close={() => {
            dispatch({ type: 'operation', payload: { saveVisible: false, current: {} } });
            setAdd(false);
          }}
          save={(item: GroupItem) => saveGroup(item)}
        />
      )}
      {bindVisible && (
        <Modal
          title="绑定设备"
          visible
          width="80vw"
          onCancel={() => {
            dispatch({
              type: 'operation',
              payload: {
                deviceIds: [],
                bindVisible: false
              },
            });
          }}
          onOk={() => {
            bindDevice();
          }}
        >
          <ChoiceDevice
            parentId={parentId}
            save={(item: any[]) => {
              dispatch({
                type: 'operation',
                payload: {
                  deviceIds: item,
                },
              });
            }}
          />
        </Modal>
      )}
      {detailVisible && (
        <Drawer
          visible
          width="80vw"
          title="设备详情"
          onClose={() => {
            dispatch({
              type: 'operation',
              payload: {
                detailVisible: false,
              },
            });
          }}
        >
          <DeviceInfo
            location={{
              pathname: `/device/instance/save/${device.id}`,
              search: '',
              hash: '',
              query: {},
              state: undefined,
            }}
          />
        </Drawer>
      )}
    </PageHeaderWrapper>
  );
};
export default DeviceTree;
