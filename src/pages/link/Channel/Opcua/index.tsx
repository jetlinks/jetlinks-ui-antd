import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Card, Col, Row } from 'antd';
import styles from './index.less';
import { PermissionButton } from '@/components';
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useIntl } from 'umi';
import { useRef } from 'react';
import SearchComponent from '@/components/SearchComponent';

const Opcua = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  // const [param, setParam] = useState({});
  const { permission } = PermissionButton.usePermission('link/Channel/Opcua');

  const iconMap = new Map();
  iconMap.set('1', require('/public/images/channel/1.png'));
  iconMap.set('2', require('/public/images/channel/2.png'));
  iconMap.set('3', require('/public/images/channel/3.png'));
  iconMap.set('4', require('/public/images/channel/4.png'));
  const background = require('/public/images/channel/background.png');

  const columns: ProColumns<any>[] = [
    {
      title: '通道名称',
      dataIndex: 'name',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '端口',
      dataIndex: 'local',
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
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
                record.state.value !== 'notActive' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: '确认禁用？',
            }),
            onConfirm: async () => {
              // if (record.state.value !== 'notActive') {
              //   await service.undeployDevice(record.id);
              // } else {
              //   await service.deployDevice(record.id);
              // }
              // message.success(
              //   intl.formatMessage({
              //     id: 'pages.data.option.success',
              //     defaultMessage: '操作成功!',
              //   }),
              // );
              // actionRef.current?.reload();
            },
          }}
          isPermission={permission.action}
          tooltip={{
            title: intl.formatMessage({
              id: `pages.data.option.${
                record.state.value !== 'notActive' ? 'disabled' : 'enabled'
              }`,
              defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
            }),
          }}
        >
          {record.state.value !== 'notActive' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.view}
          style={{ padding: 0 }}
          key="button"
          type="link"
          tooltip={{
            title: '设备接入',
          }}
          onClick={() => {}}
        >
          <LinkOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除',
            onConfirm: async () => {
              // const resp: any = await service.remove(record.id);
              // if (resp.status === 200) {
              //   message.success(
              //     intl.formatMessage({
              //       id: 'pages.data.option.success',
              //       defaultMessage: '操作成功!',
              //     }),
              //   );
              //   actionRef.current?.reload();
              // }
            },
          }}
          key="button"
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
      title: 'OPC UA通道',
      text: '配置OPC UA通道',
    },
    {
      numeber: '2',
      title: '设备接入网关',
      text: '创建OPC UA设备接入网关',
    },
    {
      numeber: '3',
      title: '创建产品',
      text: '创建产品,并选择接入方式为OPC UA',
    },
    {
      numeber: '4',
      title: '添加设备',
      text: '添加设备，单独为每一个设备进行数据点绑定',
    },
  ];
  return (
    <PageContainer>
      <Card style={{ marginBottom: 10 }}>
        <Row gutter={[24, 24]}>
          {topCard.map((item) => (
            <Col span={6}>
              <Card>
                <div className={styles.topCard}>
                  <div
                    style={{
                      background: `url(${background}) no-repeat`,
                      backgroundSize: '100% 100%',
                      width: '56px',
                      height: '56px',
                    }}
                  >
                    <img src={iconMap.get(item.numeber)} className={styles.img} />
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
          console.log(data);
          // setParam(data);
        }}
      />
      <ProTable<UserItem>
        actionRef={actionRef}
        // params={param}
        columns={columns}
        search={false}
        headerTitle={
          <PermissionButton
            onClick={() => {
              // setMode('add');
            }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
        // request={async (params) =>
        //   service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        // }
      />
    </PageContainer>
  );
};
export default Opcua;
