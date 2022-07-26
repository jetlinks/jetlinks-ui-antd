import { Badge, Button, Card, Divider, Dropdown, Input, Menu, Modal } from 'antd';
import { useDomFullHeight } from '@/hooks';
import './index.less';
import SearchComponent from '@/components/SearchComponent';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import PermissionButton from '@/components/PermissionButton';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useIntl } from 'umi';
import ChannelCard from '../channelCard';
import { PageContainer } from '@ant-design/pro-layout';
import Service from './service';
import SaveChannel from './saveChannel';
import SavePoint from './savePoint';

export const service = new Service('');

const NewModbus = () => {
  const { minHeight } = useDomFullHeight(`.opc`);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('link/Channel/Opcua');
  const [param, setParam] = useState({});
  const [activeKey, setActiveKey] = useState<any>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [visiblePoint, setVisiblePoint] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [pointDetail, setPointDetail] = useState<any>({});
  const data = [
    {
      id: 1,
      status: 'connect',
      state: {
        text: '正常',
        value: 'enabled',
      },
    },
    {
      id: 2,
      status: 'disconnect',
      state: {
        text: '禁用',
        value: 'disabled',
      },
    },
  ];
  const dataSoure = [
    {
      id: 1,
      name: '111',
      number: '0xF831',
      collect: {
        text: '采集失败',
        value: 'collectError',
      },
      state: {
        text: '禁用',
        value: 'disabled',
      },
    },
  ];

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      fixed: 'left',
    },
    {
      title: '点位ID',
      dataIndex: 'host',
    },
    {
      title: '数据模式',
      dataIndex: 'port',
      search: false,
      valueType: 'digit',
    },
    {
      title: '当前数据',
      dataIndex: 'port',
      search: false,
      valueType: 'digit',
    },
    {
      title: '采集状态',
      // dataIndex: 'collect',
      search: false,
      render: (record: any) => (
        <>
          {record.collect.text}
          <SearchOutlined
            style={{ color: '#1d39c4', marginLeft: 3 }}
            onClick={() => {
              Modal.error({
                title: '失败原因',
                content: <div>111111</div>,
                onOk() {},
              });
            }}
          />
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: intl.formatMessage({
            id: 'pages.data.option.disabled',
            defaultMessage: '禁用',
          }),
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
      filterMultiple: false,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            // setVisible(true);
            // setCurrent(record);
          }}
          type={'link'}
          style={{ padding: 0 }}
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
          type="link"
          key={'action'}
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record.state.value !== 'disabled' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              //   if (record.state.value === 'disabled') {
              //     await service.edit({
              //       ...record,
              //       state: 'enabled',
              //     });
              //   } else {
              //     await service.edit({
              //       ...record,
              //       state: 'disabled',
              //     });
              //   }
              //   onlyMessage(
              //     intl.formatMessage({
              //       id: 'pages.data.option.success',
              //       defaultMessage: '操作成功!',
              //     }),
              //   );
              //   actionRef.current?.reload();
            },
          }}
          isPermission={permission.action}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${record.state.value !== 'disabled' ? 'disabled' : 'enabled'}`,
              defaultMessage: record.state.value !== 'disabled' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          disabled={record.state.value === 'enabled'}
          popConfirm={{
            title: '确认删除',
            disabled: record.state.value === 'enabled',
            onConfirm: async () => {
              //   const resp: any = await service.remove(record.id);
              //   if (resp.status === 200) {
              //     onlyMessage(
              //       intl.formatMessage({
              //         id: 'pages.data.option.success',
              //         defaultMessage: '操作成功!',
              //       }),
              //     );
              //     actionRef.current?.reload();
              //   }
            },
          }}
          key="delete"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
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
            // setExportVisible(true);
          }}
        >
          批量导出设备
        </PermissionButton>
      </Menu.Item>
      <Menu.Item key="2">
        <PermissionButton
          isPermission={permission.import}
          icon={<ImportOutlined />}
          onClick={() => {
            // setImportVisible(true);
          }}
        >
          批量导入设备
        </PermissionButton>
      </Menu.Item>
    </Menu>
  );

  return (
    <PageContainer>
      <Card className="modbus" style={{ minHeight }}>
        <div className="item">
          <div className="item-left">
            <div style={{ width: 220 }}>
              <Input.Search
                placeholder="请输入名称"
                allowClear
                onSearch={(value) => {
                  console.log(value);
                }}
              />
              <PermissionButton
                onClick={() => {
                  setVisible(true);
                  setCurrent({});
                }}
                isPermission={permission.add}
                key="add"
                icon={<PlusOutlined />}
                type="default"
                style={{ width: '100%', marginTop: 16 }}
              >
                新增
              </PermissionButton>
              <div className="item-left-list">
                {data.map((item) => (
                  <ChannelCard
                    active={activeKey === item.id}
                    data={item}
                    onClick={() => {
                      setActiveKey(item.id);
                    }}
                    actions={
                      <>
                        <PermissionButton
                          isPermission={permission.update}
                          key="edit"
                          onClick={() => {
                            // setVisible(true);
                            // setCurrent(record);
                          }}
                          type={'link'}
                          style={{ padding: 0 }}
                        >
                          <EditOutlined />
                          编辑
                        </PermissionButton>
                        <Divider type="vertical" />
                        <PermissionButton
                          isPermission={permission.update}
                          key="enbale"
                          type={'link'}
                          style={{ padding: 0 }}
                          popConfirm={{
                            title: intl.formatMessage({
                              id: `pages.data.option.${
                                item.state.value !== 'disabled' ? 'disabled' : 'enabled'
                              }.tips`,
                              defaultMessage: '确认禁用？',
                            }),
                            onConfirm: async () => {},
                          }}
                        >
                          {item.state.value === 'enabled' ? (
                            <StopOutlined />
                          ) : (
                            <PlayCircleOutlined />
                          )}
                          {item.state.value === 'enabled' ? '禁用' : '启用'}
                        </PermissionButton>
                        <Divider type="vertical" />
                        <PermissionButton
                          isPermission={permission.delete}
                          style={{ padding: 0 }}
                          disabled={item.state.value === 'enabled'}
                          popConfirm={{
                            title: '确认删除',
                            disabled: item.state.value === 'enabled',
                            onConfirm: async () => {},
                          }}
                          key="delete"
                          type="link"
                        >
                          <DeleteOutlined />
                        </PermissionButton>
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="item-right">
            <SearchComponent<any>
              field={columns}
              target="modbus"
              onSearch={(value) => {
                actionRef.current?.reset?.();
                setParam(value);
              }}
            />
            <ProTable
              actionRef={actionRef}
              params={param}
              columns={columns}
              rowKey="id"
              dataSource={dataSoure}
              // scroll={{ x: 1000 }}
              search={false}
              headerTitle={
                <>
                  <PermissionButton
                    onClick={() => {
                      setPointDetail({});
                      setVisiblePoint(true);
                    }}
                    // isPermission={permission.add}
                    isPermission={permission.add || true}
                    key="add"
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{ marginRight: 10 }}
                  >
                    {intl.formatMessage({
                      id: 'pages.data.option.add',
                      defaultMessage: '新增',
                    })}
                  </PermissionButton>
                  <Dropdown key={'more'} overlay={menu} placement="bottom">
                    <Button>批量操作</Button>
                  </Dropdown>
                </>
              }
              // request={async (params) =>
              //     service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
              // }
            />
          </div>
        </div>
      </Card>
      {visible && (
        <SaveChannel
          data={current}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
      {visiblePoint && (
        <SavePoint
          data={pointDetail}
          close={() => {
            setVisiblePoint(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default NewModbus;
