import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem, MetadataType } from '@/pages/device/Product/typings';
import MetadataMapping from './columns';
import { Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { observer } from '@formily/react';
import MetadataModel from './model';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import PropertyImport from '@/pages/device/Product/Detail/PropertyImport';

interface Props {
  type: MetadataType;
  target: 'product' | 'device';
}

const BaseMetadata = observer((props: Props) => {
  const { type, target = 'product' } = props;
  const intl = useIntl();
  const param = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<MetadataItem[]>([]);

  const actions: ProColumns<MetadataItem>[] = [
    {
      title: '操作',
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
          <Tooltip title="编辑">
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="delete">
          <Popconfirm title="确认删除？" onConfirm={async () => {}}>
            <Tooltip title="删除">
              <DeleteOutlined />
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

  const handleSearch = async (name: string) => {
    if (name) {
      const result = await DB.getDB()
        .table(`${type}`)
        .where('id')
        .startsWithAnyOfIgnoreCase(name)
        .toArray();
      setData(result);
    } else {
      await initData();
    }
  };
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
            onSearch: handleSearch,
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              MetadataModel.importMetadata = true;
            }}
            key="button"
            icon={<ImportOutlined />}
            type="ghost"
          >
            导入属性
          </Button>,
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
      {MetadataModel.importMetadata && <PropertyImport />}
      {MetadataModel.edit && <Edit type={target} />}
    </>
  );
});
export default BaseMetadata;
