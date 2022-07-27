import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Modal } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { service } from '@/pages/system/User/index';
import Service from '@/pages/system/Role/service';
import SearchComponent from '@/components/SearchComponent';
import { onlyMessage } from '@/utils/util';

interface Props {
  visible: boolean;
  data: any;
  cancel: () => void;
}

const BindUser = (props: Props) => {
  const roleService = new Service('role');
  const intl = useIntl();
  const actionRef = useRef<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [param, setParam] = useState<any>({ terms: [] });

  const columns: ProColumns<UserItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
      tip: intl.formatMessage({
        id: 'pages.system.userName.tips',
        defaultMessage: '用户名过长会自动收缩',
      }),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.username',
        defaultMessage: '用户名',
      }),
      dataIndex: 'username',
      filters: true,
      onFilter: true,
    },
  ];

  return (
    <Modal
      title="添加"
      width={990}
      visible={props.visible}
      onCancel={() => {
        props.cancel();
        setSelectedRowKeys([]);
      }}
      onOk={() => {
        roleService.bindUser(props.data.id, selectedRowKeys).subscribe((resp) => {
          if (resp.status === 200) {
            onlyMessage('操作成功！');
            actionRef.current?.reload();
          }
        });
        setSelectedRowKeys([]);
        props.cancel();
      }}
    >
      <SearchComponent<UserItem>
        field={columns}
        target="user"
        // pattern={'simple'}
        enableSave={false}
        model="simple"
        onSearch={(data) => {
          // console.log(data);
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   setParam({});
        // }}
      />
      <ProTable
        actionRef={actionRef}
        search={false}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (key) => {
            setSelectedRowKeys(key as string[]);
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        columnEmptyText={''}
        request={async (params: any) => {
          const response = await service.query({
            pageSize: params.pageSize,
            pageIndex: params.current,
            terms: [
              ...(param?.terms || []),
              {
                terms: [
                  {
                    column: 'id$in-dimension$role$not',
                    value: props.data.id,
                  },
                ],
              },
            ],
          });
          return {
            result: {
              data: response.result.data,
              pageSize: response.result.pageSize,
              pageIndex: response.result.pageIndex,
              total: response.result.total,
            },
            success: true,
            status: 200,
          } as any;
        }}
        columns={columns}
        rowKey="id"
        toolBarRender={false}
      />
    </Modal>
  );
};

export default BindUser;
