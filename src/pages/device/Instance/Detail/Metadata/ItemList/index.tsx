import type { MetadataItem } from '@/pages/device/Product/typings';
import { InstanceModel } from '@/pages/device/Instance';
import { Popconfirm, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import ProList from '@jetlinks/pro-list';

interface Props {
  metadata: Partial<MetadataItem>;
}

const ItemList = (props: Props) => {
  const { metadata } = props;
  return (
    <ProList
      rowKey="id"
      bordered={true}
      showActions="hover"
      onRow={(record: MetadataItem) => {
        return {
          onClick: () => {
            InstanceModel.metadataItem = record;
          },
        };
      }}
      dataSource={metadata.properties}
      metas={{
        title: {
          dataIndex: 'name',
        },
        id: {
          dataIndex: 'id',
        },
        actions: {
          render: (text, row) => [
            <Popconfirm
              onConfirm={() => {
                console.log(row);
              }}
              title="确认删除？"
            >
              <Tooltip title="删除">
                <a>
                  <CloseCircleOutlined />
                </a>
              </Tooltip>
            </Popconfirm>,
          ],
        },
      }}
    ></ProList>
  );
};
export default ItemList;
