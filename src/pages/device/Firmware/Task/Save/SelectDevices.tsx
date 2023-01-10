import { Badge, Checkbox, Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Key } from 'react';
import { useEffect, useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from '@/pages/device/Instance/service';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import moment from 'moment';
import SearchComponent from '@/components/SearchComponent';

interface Props {
  id?: string;
  value?: Partial<DeviceInstance>[];
  onChange?: (data: Partial<DeviceInstance>[]) => void;
  productId?: string;
  disabled?: boolean;
}

const deviceStatus = new Map();
deviceStatus.set('online', <Badge status="success" text={'在线'} />);
deviceStatus.set('offline', <Badge status="error" text={'离线'} />);
deviceStatus.set('notActive', <Badge status="processing" text={'禁用'} />);

const service = new Service('device/instance');
const State = model<{
  visible: boolean;
  data: Partial<DeviceInstance>[];
  dataList: Partial<DeviceInstance>[];
  searchParam: any;
}>({
  visible: false,
  data: [],
  dataList: [],
  searchParam: { terms: [] },
});

const SelectDevices = observer((props: Props) => {
  const intl = useIntl();
  const actionRef1 = useRef<ActionType>();
  // const [searchParam, setSearchParam] = useState<any>({terms: []});
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
      render: (text: any, record: any) => record?.firmwareInfo?.version || '',
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

  // const [data, setData] = useState<Partial<DeviceInstance>[]>(props?.value || []);
  // const [dataList, setDataList] = useState<Partial<DeviceInstance>[]>(props?.value || []);

  const rowSelection = {
    onSelect: (selectedRow: any, selected: any) => {
      let newSelectKeys = [...State.data];
      if (selected) {
        newSelectKeys.push({ ...selectedRow });
      } else {
        newSelectKeys = newSelectKeys.filter((item) => item.id !== selectedRow.id);
      }
      State.data = newSelectKeys;
    },
    onSelectAll: (selected: boolean, _: any, changeRows: any) => {
      let newSelectKeys = [...State.data];
      if (selected) {
        changeRows.forEach((item: any) => {
          newSelectKeys.push({ ...item });
        });
      } else {
        newSelectKeys = newSelectKeys.filter((a) => {
          return !changeRows.some((b: any) => b.id === a.id);
        });
      }
      State.data = newSelectKeys;
    },
    selectedRowKeys: State.data?.map((item) => item.id) as Key[],
  };

  const CheckAllData = () => {
    service
      .queryDetailListNoPaging({
        context: {
          includeTags: false,
          includeBind: false,
          includeRelations: false,
        },
        ...State.searchParam,
        terms: [
          ...(State.searchParam?.terms || []),
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
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          State.dataList = resp.result;
        }
      });
  };

  useEffect(() => {
    State.searchParam = { terms: [] };
    State.data = props?.value || [];
    CheckAllData();
  }, [props?.value]);

  return (
    <>
      <Input
        disabled
        value={props.value?.map((item) => item.name).join(',')}
        id={props?.id}
        addonAfter={
          <EditOutlined
            onClick={() => {
              if (props.disabled) {
                State.visible = false;
              } else {
                State.visible = true;
              }
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
          }}
          destroyOnClose={true}
          onOk={() => {
            State.visible = false;
            if (props.onChange) {
              props.onChange(State.data);
            }
          }}
        >
          <SearchComponent<DeviceInstance>
            field={columns}
            enableSave={false}
            model="simple"
            onSearch={(data1: any) => {
              actionRef1.current?.reset?.();
              State.searchParam = data1;
              State.data = [];
              State.dataList = [];
              CheckAllData();
            }}
            target="choose-devices"
          />
          <ProTable<DeviceInstance>
            tableAlertRender={false}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            headerTitle={[
              <Checkbox
                indeterminate={State.dataList.length > State.data.length && State.data.length > 0}
                style={{ marginLeft: 8 }}
                disabled={!State.dataList.length}
                checked={State.dataList.length === State.data.length && State.dataList.length > 0}
                onChange={async (e) => {
                  if (e.target.checked) {
                    State.data = State.dataList;
                  } else {
                    State.data = [];
                  }
                }}
              >
                全选
              </Checkbox>,
            ]}
            search={false}
            columnEmptyText={''}
            rowKey="id"
            params={State.searchParam}
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

export default SelectDevices;
