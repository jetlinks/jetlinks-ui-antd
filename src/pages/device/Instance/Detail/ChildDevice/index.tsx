import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { LogItem } from '@/pages/device/Instance/Detail/Log/typings';
import { Badge, Card, Tooltip } from 'antd';
import { DisconnectOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useRef, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import BindChildDevice from './BindChildDevice';
import moment from 'moment';
import { Link } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';
import SaveChild from './SaveChild';
import PermissionButton from '../../../../../components/PermissionButton';

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

interface Props {
  data: any;
}

const ChildDevice = (props: Props) => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const [childVisible, setChildVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;

  const { minHeight } = useDomFullHeight(`.device-detail-childDevice`);

  const unBindSingleDevice = async (id: string) => {
    const resp = await service.unbindDevice(InstanceModel.detail.id!, id, {});
    if (resp.status === 200) {
      actionRef.current?.reset?.();
      onlyMessage('操作成功！');
    }
  };

  const handleUnBind = async () => {
    if (bindKeys.length) {
      const resp = await service.unbindBatchDevice(InstanceModel.detail.id!, bindKeys);
      if (resp.status === 200) {
        onlyMessage('操作成功！');
        setBindKeys([]);
        actionRef.current?.reset?.();
      }
    } else {
      onlyMessage('请勾选需要解绑的数据', 'warning');
    }
  };

  const columns: ProColumns<LogItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '所属产品',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      valueType: 'dateTime',
      render: (text: any, record: any) => {
        return !record?.registryTime
          ? ''
          : moment(record?.registryTime).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueType: 'select',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'describe',
      width: '15%',
      ellipsis: true,
      // hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'left',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <Link
          to={`${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id)}`}
          key="link"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <SearchOutlined />
          </Tooltip>
        </Link>,
        // <a key="unbind">
        //   <Popconfirm
        //     onConfirm={() => {
        //       unBindSingleDevice(record.id);
        //     }}
        //     title={'确认解绑吗？'}
        //   >
        //     <Tooltip title={'解绑'}>
        //       <DisconnectOutlined />
        //     </Tooltip>
        //   </Popconfirm>
        // </a>,
        <PermissionButton
          key="unbind"
          type={'link'}
          popConfirm={{
            title: '确认解绑吗?',
            onConfirm: async () => {
              unBindSingleDevice(record.id);
            },
          }}
          tooltip={{
            title: devicePermission.update ? '解绑' : '暂无权限，请联系管理员',
          }}
          style={{ padding: 0 }}
          isPermission={devicePermission.update}
        >
          <DisconnectOutlined />
        </PermissionButton>,
        <>
          {props.data.accessProvider === 'official-edge-gateway' && (
            // <a
            //   onClick={() => {
            //     setCurrent(record);
            //     setChildVisible(true);
            //   }}
            // >
            //   <Tooltip title={'编辑'} key={'edit'}>
            //     <EditOutlined />
            //   </Tooltip>
            // </a>
            <PermissionButton
              key={'edit'}
              type={'link'}
              onClick={() => {
                setCurrent(record);
                setChildVisible(true);
              }}
              tooltip={{
                placement: 'top',
                title: devicePermission.update ? '编辑' : '暂无权限，请联系管理员',
              }}
              style={{ padding: 0 }}
              isPermission={devicePermission.update}
            >
              <EditOutlined />
            </PermissionButton>
          )}
        </>,
      ],
    },
  ];

  return (
    <Card className={'device-detail-childDevice'} style={{ minHeight }}>
      {childVisible ? (
        <SaveChild
          data={props.data}
          childData={current}
          close={() => {
            setChildVisible(false);
          }}
        />
      ) : (
        <>
          <SearchComponent<LogItem>
            field={[...columns]}
            target="child-device"
            enableSave={false}
            // pattern={'simple'}
            defaultParam={[
              { column: 'parentId', value: InstanceModel?.detail?.id || '', termType: 'eq' },
            ]}
            onSearch={(param) => {
              actionRef.current?.reset?.();
              setSearchParams(param);
            }}
            // onReset={() => {
            //   // 重置分页及搜索参数
            //   actionRef.current?.reset?.();
            //   setSearchParams({});
            // }}
          />
          <ProTable<LogItem>
            search={false}
            columns={columns}
            // size="small"
            scroll={{ x: 1366 }}
            actionRef={actionRef}
            params={searchParams}
            rowKey="id"
            columnEmptyText={''}
            rowSelection={{
              selectedRowKeys: bindKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setBindKeys(selectedRows.map((item) => item.id));
              },
            }}
            toolBarRender={() => [
              <>
                {props.data.accessProvider === 'official-edge-gateway' && (
                  // <Button
                  //   onClick={() => {
                  //     // actionRef.current?.reset?.();
                  //     setCurrent({});
                  //     setChildVisible(true);
                  //   }}
                  //   key="save"
                  //   type="primary"
                  // >
                  //   新增并绑定
                  // </Button>
                  <PermissionButton
                    key={'edit'}
                    type={'primary'}
                    onClick={() => {
                      setCurrent({});
                      setChildVisible(true);
                    }}
                    tooltip={{
                      placement: 'top',
                      title: devicePermission.update ? '' : '暂无权限，请联系管理员',
                    }}
                    isPermission={devicePermission.update}
                  >
                    新增并绑定
                  </PermissionButton>
                )}
              </>,
              // <Button
              //   onClick={() => {
              //     setVisible(true);
              //     actionRef.current?.reset?.();
              //   }}
              //   key="bind"
              //   type="primary"
              // >
              //   绑定
              // </Button>,
              <PermissionButton
                key={'bind'}
                type={'primary'}
                onClick={() => {
                  setVisible(true);
                  actionRef.current?.reset?.();
                }}
                tooltip={{
                  placement: 'top',
                  title: devicePermission.update ? '' : '暂无权限，请联系管理员',
                }}
                isPermission={devicePermission.update}
              >
                绑定
              </PermissionButton>,
              // <Popconfirm key="unbind" onConfirm={handleUnBind} title={'确认解绑吗？'}>
              //   <Button>批量解绑</Button>
              // </Popconfirm>,
              <PermissionButton
                key={'unbind'}
                type={'primary'}
                popConfirm={{
                  title: '确认解绑吗?',
                  onConfirm: async () => {
                    handleUnBind();
                  },
                }}
                tooltip={{
                  placement: 'top',
                  title: devicePermission.update ? '' : '暂无权限，请联系管理员',
                }}
                isPermission={devicePermission.update}
              >
                批量解绑
              </PermissionButton>,
            ]}
            pagination={{
              pageSize: 10,
            }}
            request={(params) => service.query(params)}
          />
          {visible && (
            <BindChildDevice
              data={{}}
              onCancel={() => {
                setVisible(false);
                actionRef.current?.reload?.();
              }}
            />
          )}
        </>
      )}
    </Card>
  );
};
export default ChildDevice;
