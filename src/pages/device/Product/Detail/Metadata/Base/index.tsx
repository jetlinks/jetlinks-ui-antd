import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem } from '@/pages/device/Product/typings';
import MetadataMapping from '@/pages/device/Product/Detail/Metadata/Base/columns';
import { Popconfirm, Tooltip } from 'antd';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import Edit from '@/pages/device/Product/Detail/Metadata/Base/Edit';
import { observer } from '@formily/react';
import MetadataModel from '@/pages/device/Product/Detail/Metadata/Base/model';

interface Props {
  type: 'events' | 'function' | 'property' | 'tag';
}

const BaseMetadata = observer((props: Props) => {
  const { type } = props;
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
      />
      {MetadataModel.edit && <Edit />}
    </>
  );
});
export default BaseMetadata;
