import { Badge, Button, Input, message, Modal } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { DeviceItem } from '@/pages/system/Department/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { queryDevice } from '@/pages/rule-engine/Scene/Save/action/device/service';
import { AIcon } from '@/components';

interface DeviceModelProps {
  value?: ChangeValueType[];
  onChange?: (value: ChangeValueType[]) => void;
  productId?: string;
}

type DeviceBadgeProps = {
  type: string;
  text: string;
};

type ChangeValueType = {
  name: string;
  value: string;
};

const DeviceBadge = (props: DeviceBadgeProps) => {
  const STATUS = {
    notActive: 'processing',
    offline: 'error',
    online: 'success',
  };
  return <Badge status={STATUS[props.type]} text={props.text} />;
};

export default (props: DeviceModelProps) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [selectKeys, setSelectKeys] = useState<ChangeValueType[]>(props.value || []);
  const [searchParam, setSearchParam] = useState({});
  const [value, setValue] = useState<ChangeValueType[]>(props.value || []);

  useEffect(() => {
    setValue(props.value || []);
    setSelectKeys(props.value || []);
  }, [props.value]);

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
        onLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'onLine',
        },
        offLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offLine',
        },
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
      },
      search: false,
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
    },
  ];

  const onClick = useCallback(() => {
    if (!props.productId) {
      message.warning('请选择产品');
    } else {
      setVisible(true);
      setSelectKeys(value ? [...value] : []);
    }
  }, [props.productId, value]);

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          title={'设备'}
          width={880}
          onOk={() => {
            if (!selectKeys.length) {
              message.warning('请勾选设备');
              return;
            }
            if (props.onChange) {
              props.onChange(selectKeys);
            }
            setVisible(false);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setVisible(false);
            actionRef.current?.reload();
            setSelectKeys([]);
          }}
        >
          <SearchComponent<DeviceItem>
            field={columns}
            enableSave={false}
            model={'simple'}
            onSearch={async (data) => {
              actionRef.current?.reset?.();
              setSearchParam(data);
            }}
            defaultParam={[{ column: 'productId', value: props.productId! }]}
            target="scene-actions-device"
          />
          <ProTable<DeviceItem>
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            search={false}
            columnEmptyText={''}
            rowSelection={{
              selectedRowKeys: selectKeys.map((item) => item.value),
              onSelect: (selectedRow: any, selected: any) => {
                let newSelectKeys = [...selectKeys];
                if (selected) {
                  newSelectKeys.push({ name: selectedRow.name, value: selectedRow.id });
                } else {
                  newSelectKeys = newSelectKeys.filter((item) => item.value !== selectedRow.id);
                }
                setSelectKeys(newSelectKeys);
              },
              onSelectAll: (selected, _, changeRows) => {
                let newSelectKeys = [...selectKeys];
                if (selected) {
                  changeRows.forEach((item) => {
                    newSelectKeys.push({ name: item.name, value: item.id });
                  });
                } else {
                  newSelectKeys = newSelectKeys.filter((a) => {
                    return !changeRows.some((b) => b.id === a.value);
                  });
                }
                setSelectKeys(newSelectKeys);
              },
            }}
            tableAlertOptionRender={() => (
              <Button
                type={'link'}
                onClick={() => {
                  setSelectKeys([]);
                }}
              >
                取消选择
              </Button>
            )}
            request={(params) => queryDevice(params)}
            params={searchParam}
          ></ProTable>
        </Modal>
      )}
      <Input
        placeholder={'请选择设备'}
        onClick={onClick}
        addonAfter={<AIcon type={'icon-shebei'} onClick={onClick} />}
        style={{ width: '100%' }}
        value={value && value.map((item) => item.name).toString()}
        readOnly
      />
    </>
  );
};
