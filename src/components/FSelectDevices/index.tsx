import { Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Key } from 'react';
import { useRef, useState } from 'react';
import { connect } from '@formily/react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from '@/pages/device/Instance/service';
import SearchComponent from '../SearchComponent';
import _ from 'lodash';

interface Props {
  value: Partial<DeviceInstance>[];
  onChange: (data: Partial<DeviceInstance>[]) => void;
  productId?: string;
}

export const service = new Service('device/instance');
const FSelectDevices = connect((props: Props) => {
  // todo 考虑与单选设备合并
  const [visible, setVisible] = useState<boolean>(false);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
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
      dataIndex: 'registerTime',
      width: '200px',
      valueType: 'dateTime',
    },
  ];

  const [data, setData] = useState<Partial<DeviceInstance>[]>(props?.value || []);
  const rowSelection = {
    onChange: (selectedRowKeys: Key[], selectedRows: DeviceInstance[]) => {
      const list = [...data];
      selectedRows.map((item) => {
        if (!_.map(data, 'id').includes(item.id)) {
          list.push(item);
        }
      });
      setData(list);
    },
    selectedRowKeys: data?.map((item) => item.id) as Key[],
  };

  return (
    <>
      <Input
        disabled
        value={props.value?.map((item) => item.name).join(',')}
        addonAfter={<EditOutlined onClick={() => setVisible(true)} />}
      />
      {visible && (
        <Modal
          maskClosable={false}
          visible
          title="选择设备"
          width="80vw"
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false);
            props.onChange(data);
          }}
        >
          <SearchComponent<DeviceInstance>
            field={columns}
            enableSave={false}
            model="simple"
            onSearch={async (data1) => {
              setSearchParam(data1);
              actionRef.current?.reset?.();
            }}
            target="choose-device"
          />
          <ProTable<DeviceInstance>
            tableAlertRender={false}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            search={false}
            columnEmptyText={''}
            toolBarRender={false}
            rowKey="id"
            pagination={{
              pageSize: 10,
            }}
            params={searchParam}
            columns={columns}
            actionRef={actionRef}
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
