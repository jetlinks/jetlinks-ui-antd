// 资产-产品分类-绑定
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from './index';
import { Modal } from 'antd';
import { useParams } from 'umi';
import Models from './model';
import { useRef } from 'react';
import { observer } from '@formily/react';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ProductCategoryItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'username',
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      search: {
        transform: (value) => ({ username$LIKE: value }),
      },
    },
  ];

  const handleBind = () => {
    if (Models.bindUsers.length) {
      // service.handleUser(param.id, Models.bindUsers, 'bind').subscribe({
      //   next: () => message.success('操作成功'),
      //   error: () => message.error('操作失败'),
      //   complete: () => {
      //     Models.bindUsers = [];
      //     actionRef.current?.reload();
      //     props.reload();
      //     props.onCancel()
      //   },
      // });
    } else {
      props.onCancel();
    }
  };

  return (
    <Modal
      visible={props.visible}
      onOk={handleBind}
      onCancel={props.onCancel}
      width={990}
      title="绑定"
    >
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          selectedRowKeys: Models.bindUsers.map((item) => item.userId),
          onChange: (selectedRowKeys, selectedRows) => {
            Models.bindUsers = selectedRows.map((item) => ({
              name: item.name,
              userId: item.id,
            }));
          },
        }}
        request={(params) => service.queryProductCategoryList(params)}
        defaultParams={{
          'id$tenant-user$not': param.id,
        }}
      />
    </Modal>
  );
});
export default Bind;
