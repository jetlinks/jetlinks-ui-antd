// 部门-用户绑定
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { service } from '@/pages/system/Department/Member';
import { Modal } from 'antd';
import MemberModel from '@/pages/system/Department/Member/model';
import { observer } from '@formily/react';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { onlyMessage } from '@/utils/util';

interface Props {
  reload: () => void;
  visible: boolean;
  onCancel: () => void;
  parentId: string;
}

const Bind = observer((props: Props) => {
  const intl = useIntl();
  const [searchParam, setSearchParam] = useState({});
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
      // search: {
      //   transform: (value) => ({ username$LIKE: value }),
      // },
    },
  ];

  const handleBind = () => {
    if (MemberModel.bindUsers.length) {
      service.handleUser(props.parentId, MemberModel.bindUsers, 'bind').subscribe({
        next: () => onlyMessage('操作成功'),
        error: () => onlyMessage('操作失败', 'error'),
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
      width={'800'}
      bodyStyle={{
        height: 'calc(100vh - 240px);',
        overflowY: 'auto',
      }}
      title="绑定"
    >
      <SearchComponent<UserItem>
        model={'simple'}
        enableSave={false}
        field={columns}
        defaultParam={[{ column: 'id$in-dimension$org$not', value: props.parentId }]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setSearchParam({});
        // }}
        target="department-user"
      />
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        columnEmptyText={''}
        search={false}
        params={searchParam}
        rowSelection={{
          selectedRowKeys: MemberModel.bindUsers,
          onChange: (selectedRowKeys, selectedRows) => {
            MemberModel.bindUsers = selectedRows.map((item) => item.id);
          },
        }}
        request={(params) =>
          service.queryUser({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
    </Modal>
  );
});
export default Bind;
