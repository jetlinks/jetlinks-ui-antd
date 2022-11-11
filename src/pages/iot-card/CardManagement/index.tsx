import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState, useEffect } from 'react';
import type { ActionType } from '@jetlinks/pro-table';
import { PermissionButton } from '@/components';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProColumns } from '@jetlinks/pro-table';
import type { CardManagement } from './typing';
import { Button, Dropdown, Menu, message, Popconfirm } from 'antd';
import {
  ExportOutlined,
  PlusOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  StopOutlined,
  PoweroffOutlined,
  SwapOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  EyeOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import ProTable from '@jetlinks/pro-table';
import Service from './service';
import SaveModal from './SaveModal';
import ExportModal from '@/pages/iot-card/CardManagement/ExportModal';
import ImportModal from '@/pages/iot-card/CardManagement/ImportModal';
import BindDeviceModal from '@/pages/iot-card/CardManagement/BindDevice';
import moment from 'moment';
import { useDomFullHeight, useLocation } from '@/hooks';
import { onlyMessage } from '@/utils/util';
import { useHistory } from 'umi';
import { getMenuPathByParams } from '@/utils/menu';

export const service = new Service('network/card');

const CardManagementNode = () => {
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false); // 导出
  const [importVisible, setImportVisible] = useState<boolean>(false); // 导入
  const [bindDeviceVisible, setBindDeviceVisible] = useState<boolean>(false); // 绑定设备
  const [current, setCurrent] = useState<Partial<CardManagement>>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const { minHeight } = useDomFullHeight(`.iot-card-management`, 24);
  const { permission } = PermissionButton.usePermission('iot-card/CardManagement');
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const deleteItems = useRef<any>(new Map());

  useEffect(() => {
    const { state } = location;
    if (state && state.save) {
      setVisible(true);
      setCurrent({});
    }
  }, [location]);

  const columns: ProColumns<CardManagement>[] = [
    {
      title: '卡号',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: 'ICCID',
      dataIndex: 'iccId',
      ellipsis: true,
      width: 200,
    },
    {
      title: '绑定设备',
      dataIndex: 'deviceId',
      ellipsis: true,
      width: 200,
      hideInSearch: true,
      render: (_, record) => record.deviceName,
    },
    {
      title: '平台对接',
      dataIndex: 'platformConfigId',
      width: 200,
      valueType: 'select',
      request: () =>
        service
          .queryPlatformNoPage({
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [{ column: 'state', value: 'enabled' }],
          })
          .then((resp) => resp.result.map((item: any) => ({ label: item.name, value: item.id }))),
    },
    {
      title: '运营商',
      dataIndex: 'operatorName',
      width: 120,
      valueType: 'select',
      request: async () => {
        return [
          { label: '移动', value: '移动' },
          { label: '电信', value: '电信' },
          { label: '联通', value: '联通' },
        ];
      },
    },
    {
      title: '类型',
      dataIndex: 'cardType',
      width: 120,
      valueType: 'select',
      render(_, record) {
        return record.cardType?.text;
      },
      request: async () => {
        return [
          { label: '年卡', value: 'year' },
          { label: '季卡', value: 'season' },
          { label: '月卡', value: 'month' },
          { label: '其他', value: 'other' },
        ];
      },
    },
    {
      title: '总流量',
      dataIndex: 'totalFlow',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (record.totalFlow ? record.totalFlow.toFixed(2) + ' M' : ''),
    },
    {
      title: '使用流量',
      dataIndex: 'usedFlow',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (record.usedFlow ? record.usedFlow.toFixed(2) + ' M' : ''),
    },
    {
      title: '剩余流量',
      dataIndex: 'residualFlow',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (record.residualFlow ? record.residualFlow.toFixed(2) + ' M' : ''),
    },
    {
      title: '激活日期',
      dataIndex: 'activationDate',
      width: 200,
      valueType: 'dateTime',
      render: (_, record) =>
        record.activationDate ? moment(record.activationDate).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
      valueType: 'dateTime',
      render: (_, record) =>
        record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '状态',
      dataIndex: 'cardStateType',
      width: 180,
      valueType: 'select',
      render(_, record) {
        return record.cardStateType?.text;
      },
      request: async () => {
        return [
          { label: '正常', value: 'using' },
          { label: '未激活', value: 'toBeActivated' },
          { label: '停机', value: 'deactivate' },
        ];
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        return [
          <PermissionButton
            style={{ padding: 0 }}
            type="link"
            isPermission={permission.update}
            key="editable"
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
            tooltip={{
              title: intl.formatMessage({
                id: 'pages.data.option.edit',
                defaultMessage: '编辑',
              }),
            }}
          >
            <EditOutlined />
          </PermissionButton>,
          <PermissionButton
            style={{ padding: 0 }}
            type="link"
            isPermission={true}
            key="view"
            onClick={() => {
              const url = getMenuPathByParams('iot-card/CardManagement/Detail', record.id);
              history.push(url);
            }}
            tooltip={{
              title: '查看',
            }}
          >
            <EyeOutlined />
          </PermissionButton>,
          <PermissionButton
            type="link"
            key="bindDevice"
            style={{ padding: 0 }}
            isPermission={permission.delete}
            tooltip={{ title: record.deviceId ? '解绑设备' : '绑定设备' }}
            popConfirm={
              record.deviceId
                ? {
                    title: '确认解绑设备？',
                    onConfirm: () => {
                      service.unbind(record.id).then((resp) => {
                        if (resp.status === 200) {
                          message.success('操作成功');
                          actionRef.current?.reload();
                        }
                      });
                    },
                  }
                : undefined
            }
            onClick={() => {
              if (!record.deviceId) {
                setCurrent(record);
                setBindDeviceVisible(true);
              }
            }}
          >
            {record.deviceId ? <DisconnectOutlined /> : <LinkOutlined />}
          </PermissionButton>,
          record.cardStateType?.value === 'toBeActivated' ? (
            <PermissionButton
              type="link"
              key="activation"
              style={{ padding: 0 }}
              isPermission={permission.active}
              tooltip={{ title: '激活' }}
              popConfirm={{
                title: '确认激活？',
                onConfirm: async () => {
                  service.changeDeploy(record.id).then((resp) => {
                    if (resp.status === 200) {
                      message.success('操作成功');
                      actionRef.current?.reload();
                    }
                  });
                },
              }}
            >
              <CheckCircleOutlined />
            </PermissionButton>
          ) : (
            <PermissionButton
              type="link"
              key="activation"
              style={{ padding: 0 }}
              isPermission={permission.action}
              tooltip={{ title: record.cardStateType?.value === 'deactivate' ? '复机' : '停用' }}
              popConfirm={{
                title: record.cardStateType?.value === 'deactivate' ? '确认复机？' : '确认停用?',
                onConfirm: async () => {
                  if (record.cardStateType?.value === 'deactivate') {
                    service.resumption(record.id).then((resp) => {
                      if (resp.status === 200) {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      }
                    });
                  } else {
                    service.unDeploy(record.id).then((resp) => {
                      if (resp.status === 200) {
                        message.success('操作成功');
                        actionRef.current?.reload();
                      }
                    });
                  }
                },
              }}
            >
              {record.cardStateType?.value === 'deactivate' ? (
                <PoweroffOutlined />
              ) : (
                <StopOutlined />
              )}
            </PermissionButton>
          ),
          <PermissionButton
            type="link"
            key="delete"
            style={{ padding: 0 }}
            isPermission={permission.delete}
            tooltip={{ title: '删除' }}
          >
            <Popconfirm
              onConfirm={async () => {
                const resp: any = await service.remove(record.id);
                if (resp.status === 200) {
                  onlyMessage(
                    intl.formatMessage({
                      id: 'pages.data.option.success',
                      defaultMessage: '操作成功!',
                    }),
                  );
                  actionRef.current?.reload();
                }
              }}
              title="确认删除?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </PermissionButton>,
        ];
      },
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <PermissionButton
          isPermission={permission.export}
          icon={<ExportOutlined />}
          type="default"
          onClick={() => {
            setExportVisible(true);
          }}
          style={{ width: '100%' }}
        >
          批量导出
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="2">
        <PermissionButton
          isPermission={permission.import}
          icon={<ImportOutlined />}
          type="default"
          onClick={() => {
            setImportVisible(true);
          }}
          style={{ width: '100%' }}
        >
          批量导入
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="3">
        <PermissionButton
          isPermission={permission.active}
          icon={<CheckCircleOutlined />}
          type="default"
          popConfirm={{
            title: '确认激活吗?',
            onConfirm: async () => {
              if (bindKeys.length >= 10 && bindKeys.length <= 100) {
                service.changeDeployBatch(bindKeys).then((res) => {
                  if (res.status === 200) {
                    message.success('操作成功');
                  }
                });
              } else {
                message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
              }
            },
          }}
          style={{ width: '100%' }}
        >
          批量激活
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="4">
        <PermissionButton
          isPermission={permission.action}
          icon={<StopOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认停用吗?',
            onConfirm: async () => {
              if (bindKeys.length >= 10 && bindKeys.length <= 100) {
                service.unDeployBatch(bindKeys).then((res) => {
                  if (res.status === 200) {
                    message.success('操作成功');
                  }
                });
              } else {
                message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
              }
            },
          }}
          style={{ width: '100%' }}
        >
          批量停用
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="5">
        <PermissionButton
          isPermission={permission.action}
          icon={<PoweroffOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认复机吗?',
            onConfirm: async () => {
              if (bindKeys.length >= 10 && bindKeys.length <= 100) {
                service.resumptionBatch(bindKeys).then((res) => {
                  if (res.status === 200) {
                    message.success('操作成功');
                  }
                });
              } else {
                message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
              }
            },
          }}
          style={{ width: '100%' }}
        >
          批量复机
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="6">
        <PermissionButton
          isPermission={permission.sync}
          icon={<SwapOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认同步物联卡状态?',
            onConfirm: async () => {
              service.sync().then((res) => {
                if (res.status === 200) {
                  actionRef?.current?.reload();
                  message.success('同步状态成功');
                }
              });
            },
          }}
        >
          同步状态
        </PermissionButton>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <Menu.Item>
          <PermissionButton
            isPermission={permission.delete}
            icon={<DeleteOutlined />}
            type="default"
            popConfirm={{
              title: '确认删除吗?',
              onConfirm: async () => {
                console.log(deleteItems.current.values());
                service.removeCards([...deleteItems.current.values()]).then((res) => {
                  if (res.status === 200) {
                    setBindKeys([]);
                    deleteItems.current.clear();
                    message.success('操作成功');
                    actionRef?.current?.reload();
                  }
                });
              },
            }}
          >
            批量删除
          </PermissionButton>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <PageContainer>
      {visible && (
        <SaveModal
          type={current.id ? 'edit' : 'add'}
          onCancel={() => {
            setCurrent({});
            setVisible(false);
          }}
          data={current}
          onOk={() => {
            setCurrent({});
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
      {exportVisible && (
        <ExportModal
          keys={bindKeys}
          onCancel={() => {
            setExportVisible(false);
          }}
        />
      )}
      {importVisible && (
        <ImportModal
          onCancel={() => {
            setImportVisible(false);
          }}
          onOk={() => {
            actionRef.current?.reload();
          }}
        />
      )}
      {bindDeviceVisible && (
        <BindDeviceModal
          cardId={current.id!}
          onCancel={() => {
            setCurrent({});
            setBindDeviceVisible(false);
          }}
          onOk={() => {
            setCurrent({});
            setBindDeviceVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
      <SearchComponent<CardManagement>
        field={columns}
        target="iot-card-management"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTable<CardManagement>
        columns={columns}
        scroll={{ x: 1366 }}
        tableStyle={{ minHeight }}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: false }}
        tableClassName={'iot-card-management'}
        columnEmptyText={''}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        tableAlertRender={({ selectedRowKeys }) => <div>已选择 {selectedRowKeys.length} 项</div>}
        tableAlertOptionRender={() => {
          return (
            <a
              onClick={() => {
                setBindKeys([]);
                deleteItems.current.clear();
              }}
            >
              取消选择
            </a>
          );
        }}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: bindKeys,
          onChange: (selectedRowKeys) => {
            setBindKeys(selectedRowKeys);
          },
          onSelect: (record, selected) => {
            if (selected) {
              deleteItems.current.set(record.id, record);
            } else {
              deleteItems.current.delete(record.id);
            }
            console.log(deleteItems.current.values());
            setBindKeys([...deleteItems.current.keys()]);
            console.log(deleteItems.current.values());
          },
          onSelectAll: (selected, _, changeRows) => {
            if (selected) {
              changeRows.forEach((item: any) => {
                deleteItems.current.set(item.id, item);
              });
            } else {
              changeRows.forEach((item: any) => {
                deleteItems.current.delete(item.id);
              });
            }
            setBindKeys([...deleteItems.current.keys()]);
          },
        }}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            style={{ marginRight: 12 }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
          <Dropdown key={'more'} overlay={menu} placement="bottom">
            <Button>批量操作</Button>
          </Dropdown>,
        ]}
      />
    </PageContainer>
  );
};
export default CardManagementNode;
