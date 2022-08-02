import { DeleteOutlined } from '@ant-design/icons';
import { ArrayItems } from '@formily/antd';
import { Popconfirm } from 'antd';
import { service } from '@/pages/system/DataSource';
import _ from 'lodash';
import { useField } from '@formily/react';
import { Store } from 'jetlinks-store';

interface Props {
  type: any;
}

const RemoveData = (props: Props) => {
  const { type } = props;
  const row = ArrayItems.useRecord!()();

  const index = ArrayItems.useIndex!();
  const self = useField();
  const array = ArrayItems.useArray!();
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  return (
    <div>
      <Popconfirm
        title={'确认删除'}
        onConfirm={() => {
          if (self?.disabled) return;
          if (_.map(Store.get('datasource-detail-list'), 'name').includes(type.table)) {
            service.rdbTables(type.id, type.table).then((resp) => {
              if (resp.status === 200) {
                if ([..._.map(resp.result.columns, 'name')].includes(row?.name)) {
                  service.delRdbTablesColumn(type.id, type.table, [row?.name]).then((response) => {
                    if (response.status === 200) {
                      array.field?.remove?.(index);
                      array.props?.onRemove?.(index);
                    }
                  });
                } else {
                  array.field?.remove?.(index);
                  array.props?.onRemove?.(index);
                }
              }
            });
          } else {
            array.field?.remove?.(index);
            array.props?.onRemove?.(index);
          }
        }}
      >
        <DeleteOutlined />
      </Popconfirm>
    </div>
  );
};

export default RemoveData;
