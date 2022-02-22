import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem, MetadataType } from '@/pages/device/Product/typings';
import MetadataMapping from './columns';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { observer } from '@formily/react';
import MetadataModel from './model';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  type: MetadataType;
  target: 'product' | 'device';
}

const BaseMetadata = observer((props: Props) => {
  const { type, target } = props;
  const intl = useIntl();
  const param = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<MetadataItem[]>([]);

  const actions: ProColumns<MetadataItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_: unknown, record: MetadataItem) => [
        <a
          key="editable"
          onClick={() => {
            MetadataModel.edit = true;
            MetadataModel.item = record;
            MetadataModel.type = type;
            MetadataModel.action = 'edit';
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="delete">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '确认删除吗？',
            })}
            onConfirm={async () => {}}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <MinusOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const initData = useCallback(async () => {
    const result = await DB.getDB().table(`${type}`).toArray();
    setData(result);
  }, [param.id, type]);

  useEffect(() => {
    initData().then(() => setLoading(false));
  }, [initData]);

  useEffect(() => {
    const subscription = Store.subscribe(SystemConst.REFRESH_METADATA_TABLE, async (flag) => {
      if (flag) {
        await initData();
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <>
      <ProTable
        loading={loading}
        dataSource={data}
        size="small"
        columns={MetadataMapping.get(type)!.concat(actions)}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 5,
        }}
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
          search: true,
        }}
        toolbar={{
          search: {
            onSearch: async (value) => {
              // Todo 物模型属性搜索
              message.success(value);
            },
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              MetadataModel.edit = true;
              MetadataModel.item = undefined;
              MetadataModel.type = type;
              MetadataModel.action = 'add';
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.searchTable.new',
              defaultMessage: '新建',
            })}
          </Button>,
        ]}
      />
      {MetadataModel.edit && <Edit type={target} />}
    </>
  );
});
export default BaseMetadata;
