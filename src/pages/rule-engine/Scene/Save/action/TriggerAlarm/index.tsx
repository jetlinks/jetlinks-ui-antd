import { Badge, Modal, Tooltip } from 'antd';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { Store } from 'jetlinks-store';
import { useIntl } from '@@/plugin-locale/localeExports';
import { queryDefaultLevel, queryAlarmList, queryAlarmCount } from '../service';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  close: () => void;
  id: string;
}

export default (props: Props) => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    queryAlarmCount(
      encodeQuery({
        terms: {
          'id$rule-bind-alarm': props.id, // FormModel.current.id,
        },
      }),
    ).then((resp) => {
      if (resp.status === 200) {
        setCount(resp.result);
      }
    });
  }, []);

  const columns: ProColumns<ConfigurationItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '类型',
      dataIndex: 'targetType',
      renderText: (text: string) => {
        const map = {
          product: '产品',
          device: '设备',
          org: '组织',
          other: '其他',
        };
        return map[text];
      },
      valueType: 'select',
      valueEnum: {
        product: {
          text: '产品',
          status: 'product',
        },
        device: {
          text: '设备',
          status: 'device',
        },
        org: {
          text: '组织',
          status: 'org',
        },
        other: {
          text: '其他',
          status: 'other',
        },
      },
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      render: (text: any) => (
        <Tooltip
          placement="topLeft"
          title={
            (Store.get('default-level') || []).find((item: any) => item?.level === text)?.title ||
            text
          }
        >
          <div className="ellipsis">
            {(Store.get('default-level') || []).find((item: any) => item?.level === text)?.title ||
              text}
          </div>
        </Tooltip>
      ),
      valueType: 'select',
      request: async () => {
        const res = await queryDefaultLevel();
        if (res.status === 200) {
          return (res?.result?.levels || [])
            .filter((i: any) => i?.level && i?.title)
            .map((item: any) => ({
              label: item.title,
              value: item.level,
            }));
        }
        return [];
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      renderText: (state) => (
        <Badge text={state?.text} status={state?.value === 'disabled' ? 'error' : 'success'} />
      ),
      valueEnum: {
        disabled: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.disabled',
            defaultMessage: '禁用',
          }),
          status: 'disabled',
        },
        enabled: {
          text: intl.formatMessage({
            id: 'pages.device.product.status.enabled',
            defaultMessage: '正常',
          }),
          status: 'enabled',
        },
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      ellipsis: true,
    },
  ];

  return (
    <Modal
      title={'关联此场景的告警'}
      open
      width={1000}
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        props.close();
      }}
    >
      <div style={{ marginBottom: 24 }}>关联告警数量：{count}</div>
      <ProTable<ConfigurationItem>
        actionRef={actionRef}
        params={{}}
        columns={columns}
        toolBarRender={false}
        search={false}
        rowKey={'id'}
        columnEmptyText={''}
        tableAlertRender={false}
        request={(params) =>
          queryAlarmList({
            ...params,
            terms: [
              ...(params?.terms || []),
              {
                terms: [
                  {
                    column: 'id',
                    value: props.id,
                    termType: 'rule-bind-alarm',
                  },
                ],
                type: 'and',
              },
            ],
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
      />
    </Modal>
  );
};
