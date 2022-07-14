import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Card, Col, Row } from 'antd';
import styles from './index.less';
import { PermissionButton } from '@/components';
import { history, useIntl } from 'umi';
import {
  ControlOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useRef, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import Service from './service';
import Save from './Save';
import { getMenuPathByCode } from '@/utils/menu';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';
// import NewModbus from '../new'

export const service = new Service('modbus/master');

const Modbus = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const { permission } = PermissionButton.usePermission('link/Channel/Modbus');
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<OpaUa>>({});
  const { minHeight } = useDomFullHeight(`.modbus`, 24);

  const iconMap = new Map();
  iconMap.set('1', require('/public/images/channel/1.png'));
  iconMap.set('2', require('/public/images/channel/2.png'));
  iconMap.set('3', require('/public/images/channel/3.png'));
  iconMap.set('4', require('/public/images/channel/4.png'));

  const columns: ProColumns<OpaUa>[] = [
    {
      title: '通道名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: 'IP',
      dataIndex: 'host',
    },
    {
      title: '端口',
      dataIndex: 'port',
      search: false,
      valueType: 'digit',
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
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
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
              if (record.state.value === 'disabled') {
                await service.edit({
                  ...record,
                  state: 'enabled',
                });
              } else {
                await service.edit({
                  ...record,
                  state: 'disabled',
                });
              }
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
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
          isPermission={permission.view}
          style={{ padding: 0 }}
          key="link"
          type="link"
          tooltip={{
            title: '数据点绑定',
          }}
          onClick={() => {
            history.push(`${getMenuPathByCode('link/Channel/Modbus/Access')}?id=${record.id}`);
          }}
        >
          <ControlOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          disabled={record.state.value === 'enabled'}
          popConfirm={{
            title: '确认删除',
            disabled: record.state.value === 'enabled',
            onConfirm: async () => {
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

  const topCard = [
    {
      numeber: '1',
      title: 'Modbus通道',
      text: '配置Modbus通道',
    },
    {
      numeber: '2',
      title: '设备接入网关',
      text: '创建Modbus设备接入网关',
    },
    {
      numeber: '3',
      title: '创建产品',
      text: '创建产品,并选择接入方式为Modbus',
    },
    {
      numeber: '4',
      title: '添加设备',
      text: '添加设备，单独为每一个设备进行数据点绑定',
    },
  ];
  return (
    <PageContainer>
      {/* <NewModbus/> */}
      <Card style={{ marginBottom: 10 }}>
        <Row gutter={[24, 24]}>
          {topCard.map((item) => (
            <Col span={6} key={item.numeber}>
              <Card>
                <div className={styles.topCard}>
                  <div>
                    <img src={iconMap.get(item.numeber)} />
                  </div>
                  <div className={styles.text}>
                    <p className={styles.p1}>{item.title}</p>
                    <p className={styles.p2}>{item.text}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <SearchComponent<any>
        field={columns}
        target="opcua"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<OpaUa>
        actionRef={actionRef}
        params={param}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1366 }}
        search={false}
        tableClassName={'modbus'}
        tableStyle={{ minHeight }}
        headerTitle={
          <PermissionButton
            onClick={() => {
              // setMode('add');
              setVisible(true);
              setCurrent({});
            }}
            isPermission={permission.add}
            key="add"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Modbus;
