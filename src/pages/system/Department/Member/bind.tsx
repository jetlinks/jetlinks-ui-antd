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

  const unSelect = () => {
    MemberModel.bindUsers = [];
  };

  const getSelectedRowsKey = (selectedRows) => {
    return selectedRows.map((item) => item?.id).filter((item2) => !!item2 !== false);
  };

  return (
    <Modal
      visible={props.visible}
      onOk={handleBind}
      onCancel={props.onCancel}
      width={'75vw'}
      title="绑定"
      centered
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      <SearchComponent<UserItem>
        model={'simple'}
        enableSave={false}
        field={columns}
        defaultParam={[{ column: 'id$in-dimension$org$not', value: props.parentId }]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          unSelect();
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
        tableStyle={{
          height: 575,
          overflowY: 'auto',
        }}
        search={false}
        params={searchParam}
        tableAlertRender={({ selectedRowKeys }) => <div>已选择 {selectedRowKeys.length} 项</div>}
        tableAlertOptionRender={() => {
          return (
            <a
              onClick={() => {
                unSelect();
              }}
            >
              取消选择
            </a>
          );
        }}
        rowSelection={{
          selectedRowKeys: MemberModel.bindUsers,
          // onChange: (selectedRowKeys, selectedRows) => {
          //   MemberModel.bindUsers = selectedRows.map((item) => item.id);
          // },
          onSelect: (record, selected, selectedRows) => {
            if (selected) {
              MemberModel.bindUsers = [
                ...new Set([...MemberModel.bindUsers, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              MemberModel.bindUsers = MemberModel.bindUsers.filter((item) => item !== record.id);
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              MemberModel.bindUsers = [
                ...new Set([...MemberModel.bindUsers, ...getSelectedRowsKey(selectedRows)]),
              ];
            } else {
              const unChangeRowsKeys = getSelectedRowsKey(changeRows);
              MemberModel.bindUsers = MemberModel.bindUsers
                .concat(unChangeRowsKeys)
                .filter((item) => !unChangeRowsKeys.includes(item));
            }
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
