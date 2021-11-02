import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem, MetadataType } from '@/pages/device/Product/typings';
import MetadataMapping from '@/pages/device/Product/Detail/Metadata/Base/columns';
import { Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Edit from '@/pages/device/Product/Detail/Metadata/Base/Edit';
import { observer } from '@formily/react';
import MetadataModel from '@/pages/device/Product/Detail/Metadata/Base/model';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  type: MetadataType;
}

const BaseMetadata = observer((props: Props) => {
  const { type } = props;
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
              <MinusOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const initData = useCallback(async () => {
    const result = await DB.getDB().table(`${param.id}-${type}`).toArray();
    setData(result);
  }, [param.id, type]);

  useEffect(() => {
    initData().then(() => setLoading(false));
  }, [initData]);

  return (
    <>
      <ProTable
        loading={loading}
        dataSource={data}
        size="small"
        columns={MetadataMapping.get(type)!.concat(actions)}
        rowKey="id"
        search={false}
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
      {MetadataModel.edit && <Edit />}
    </>
  );
});
export default BaseMetadata;
