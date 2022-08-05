import { Badge, Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Key } from 'react';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from '@/pages/device/Instance/service';
import SearchComponent from '../SearchComponent';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import moment from 'moment';

interface Props {
  id?: string;
  value?: Partial<DeviceInstance>[];
  onChange?: (data: Partial<DeviceInstance>[]) => void;
  productId?: string;
}

const deviceStatus = new Map();
deviceStatus.set('online', <Badge status="success" text={'在线'} />);
deviceStatus.set('offline', <Badge status="error" text={'离线'} />);
deviceStatus.set('notActive', <Badge status="processing" text={'禁用'} />);

const service = new Service('device/instance');
const State = model<{
  visible: boolean;
}>({
  visible: false,
});

const FSelectDevices = observer((props: Props) => {
  // todo 考虑与单选设备合并
  const intl = useIntl();
  const actionRef1 = useRef<ActionType>();
  const [searchParam, setSearchParam] = useState({});
  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '固件版本',
      dataIndex: 'firmwareInfo',
      ellipsis: true,
      render: (text: any, record: any) => record?.version || '',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      width: '200px',
      valueType: 'dateTime',
      render: (text: any, record: any) =>
        record?.registerTime ? moment(record?.registerTime).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text: any, record: any) =>
        record?.state?.value ? deviceStatus.get(record?.state?.value) : '',
      ellipsis: true,
    },
  ];

  const [data, setData] = useState<Partial<DeviceInstance>[]>(props?.value || []);
  const rowSelection = {
    onSelect: (selectedRow: any, selected: any) => {
      let newSelectKeys = [...data];
      if (selected) {
        newSelectKeys.push({ ...selectedRow });
      } else {
        newSelectKeys = newSelectKeys.filter((item) => item.id !== selectedRow.id);
      }
      setData(newSelectKeys);
    },
    onSelectAll: (selected: boolean, _: any, changeRows: any) => {
      let newSelectKeys = [...data];
      if (selected) {
        changeRows.forEach((item: any) => {
          newSelectKeys.push({ ...item });
        });
      } else {
        newSelectKeys = newSelectKeys.filter((a) => {
          return !changeRows.some((b: any) => b.id === a.id);
        });
      }
      setData(newSelectKeys);
    },
    selectedRowKeys: data?.map((item) => item.id) as Key[],
  };

  const reload = () => {
    actionRef1.current?.reset?.();
    setSearchParam({});
  };

  return (
    <>
      <Input
        disabled
        value={props.value?.map((item) => item.name).join(',')}
        id={props?.id}
        addonAfter={
          <EditOutlined
            onClick={() => {
              State.visible = true;
            }}
          />
        }
      />
      {State.visible && (
        <Modal
          maskClosable={false}
          visible
          title="选择设备"
          width="80vw"
          onCancel={() => {
            State.visible = false;
            reload();
          }}
          onOk={() => {
            State.visible = false;
            reload();
            if (props.onChange) {
              props.onChange(data);
            }
          }}
        >
          <SearchComponent<DeviceInstance>
            field={columns}
            enableSave={false}
            model="simple"
            onSearch={(data1) => {
              actionRef1.current?.reset?.();
              setSearchParam(data1);
            }}
            target="choose-devices"
          />
          <ProTable<DeviceInstance>
            tableAlertRender={false}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            search={false}
            columnEmptyText={''}
            rowKey="id"
            params={searchParam}
            columns={columns}
            actionRef={actionRef1}
            request={async (params) => {
              return service.queryDetailList({
                context: {
                  includeTags: false,
                  includeBind: false,
                  includeRelations: false,
                },
                ...params,
                terms: [
                  ...(params?.terms || []),
                  {
                    terms: [
                      {
                        column: 'productId',
                        value: props?.productId,
                      },
                    ],
                    type: 'and',
                  },
                ],
                sorts: [{ name: 'createTime', order: 'desc' }],
              });
            }}
          />
        </Modal>
      )}
    </>
  );
});

export default FSelectDevices;
