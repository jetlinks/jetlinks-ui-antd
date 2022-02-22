// 部门-用户绑定
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/system/Department/Member';
import { message, Modal } from 'antd';
import { useParams } from 'umi';
import MemberModel from '@/pages/system/Department/Member/model';
import { observer } from '@formily/react';
import { useEffect, useRef } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (props.visible) {
      actionRef.current?.reload();
    }
  }, [props.visible]);

  const columns: ProColumns<UserItem>[] = [
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
    if (MemberModel.bindUsers.length) {
      service.handleUser(param.id, MemberModel.bindUsers, 'bind').subscribe({
        next: () => message.success('操作成功'),
        error: () => message.error('操作失败'),
        complete: () => {
          MemberModel.bindUsers = [];
          actionRef.current?.reload();
          props.reload();
          props.onCancel();
        },
      });
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
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          selectedRowKeys: MemberModel.bindUsers,
          onChange: (selectedRowKeys, selectedRows) => {
            MemberModel.bindUsers = selectedRows.map((item) => item.id);
          },
        }}
        request={(params) => service.queryUser(params)}
        defaultParams={{
          'id$in-dimension$org$not': param.id,
        }}
      />
    </Modal>
  );
});
export default Bind;
