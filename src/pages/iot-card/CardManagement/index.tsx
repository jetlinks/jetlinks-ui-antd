import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import type { ActionType } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProColumns } from '@jetlinks/pro-table';
import type { CardManagement } from './typing';
import { Button, Dropdown, Menu } from 'antd';
import {
  ExportOutlined,
  PlusOutlined,
  ImportOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import SaveModal from './SaveModal';
import Service from './service';

export const service = new Service('network/card');

const CardManagementNode = () => {
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false); // 导出
  const [importVisible, setImportVisible] = useState<boolean>(false); // 导入
  const [current, setCurrent] = useState<Partial<CardManagement>>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const { permission } = PermissionButton.usePermission('device/Instance');
  const intl = useIntl();

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
    },
    {
      title: '平台对接',
      dataIndex: 'platformConfigId',
    },
    {
      title: '运营商',
      dataIndex: 'operatorName',
    },
    {
      title: '类型',
      dataIndex: 'cardType',
    },
    {
      title: '总流量',
      dataIndex: 'totalFlow',
    },
    {
      title: '使用流量',
      dataIndex: 'usedFlow',
    },
    {
      title: '剩余流量',
      dataIndex: 'residualFlow',
    },
    {
      title: '激活日期',
      dataIndex: 'activationDate',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '状态',
      dataIndex: 'cardStateType',
      valueEnum: {
        using: {
          text: '正常',
          status: 'using',
        },
        toBeActivated: {
          text: '未激活',
          status: 'using',
        },
        deactivate: {
          text: '停机',
          status: 'using',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        console.log(_, record);
        return [];
      },
    },
  ];

  console.log(exportVisible, importVisible);

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
          导出
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
          导入
        </PermissionButton>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <Menu.Item key="3">
          <PermissionButton
            isPermission={permission.action}
            icon={<CheckCircleOutlined />}
            type="primary"
            ghost
            popConfirm={{
              title: '确认激活吗?',
              onConfirm: async () => {},
            }}
            style={{ width: '100%' }}
          >
            激活
          </PermissionButton>
        </Menu.Item>
      )}
      {bindKeys.length > 0 && (
        <Menu.Item key="4">
          <PermissionButton
            isPermission={permission.stop}
            icon={<CheckCircleOutlined />}
            type="primary"
            ghost
            popConfirm={{
              title: '确认停用吗?',
              onConfirm: async () => {},
            }}
            style={{ width: '100%' }}
          >
            停用
          </PermissionButton>
        </Menu.Item>
      )}
      {bindKeys.length > 0 && (
        <Menu.Item key="5">
          <PermissionButton
            isPermission={permission.restart}
            icon={<CheckCircleOutlined />}
            type="primary"
            ghost
            popConfirm={{
              title: '确认复机吗?',
              onConfirm: async () => {},
            }}
            style={{ width: '100%' }}
          >
            复机
          </PermissionButton>
        </Menu.Item>
      )}
      <Menu.Item key="6">
        <PermissionButton
          isPermission={permission.sync}
          icon={<CheckCircleOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认同步物联卡状态?',
            onConfirm: async () => {},
          }}
        >
          同步状态
        </PermissionButton>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <PermissionButton
          isPermission={permission.delete}
          icon={<CheckCircleOutlined />}
          type="primary"
          ghost
          popConfirm={{
            title: '确认删除吗?',
            onConfirm: async () => {},
          }}
        >
          批量删除
        </PermissionButton>
      )}
    </Menu>
  );

  return (
    <PageContainer>
      {visible && (
        <SaveModal
          type={'add'}
          onCancel={() => {
            setVisible(false);
          }}
          data={current}
          onOk={() => {
            setVisible(false);
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
      <ProTableCard<CardManagement>
        columns={columns}
        scroll={{ x: 1366 }}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
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
          onSelect: (_, selected) => {
            if (selected) {
              // InstanceModel.selectedRows.set(record.id, record?.state?.value);
            } else {
              // InstanceModel.selectedRows.delete(record.id);
            }
            // setBindKeys([...InstanceModel.selectedRows.keys()]);
          },
          onSelectAll: (selected, _, changeRows) => {
            if (selected) {
              changeRows.forEach(() => {
                // InstanceModel.selectedRows.set(item.id, item?.state?.value);
              });
            } else {
              changeRows.forEach(() => {
                // InstanceModel.selectedRows.delete(item.id);
              });
            }
            // setBindKeys([...InstanceModel.selectedRows.keys()]);
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
