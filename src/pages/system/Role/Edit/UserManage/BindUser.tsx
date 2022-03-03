import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { message, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { service } from '@/pages/system/User/index';
import encodeQuery from '@/utils/encodeQuery';
import Service from '@/pages/system/Role/service';
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
  const columns: ProColumns<RoleItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      // copyable: true,
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
      width={900}
      visible={props.visible}
      onCancel={() => {
        props.cancel();
        setSelectedRowKeys([]);
      }}
      onOk={() => {
        roleService.bindUser(props.data.id, selectedRowKeys).subscribe((resp) => {
          if (resp.status === 200) {
            message.success('操作成功！');
            actionRef.current?.reload();
          }
        });
        setSelectedRowKeys([]);
        props.cancel();
      }}
    >
      <ProTable
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (key) => {
            setSelectedRowKeys(key as string[]);
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        request={async (param: any) => {
          const response = await service.query(
            encodeQuery({
              pageSize: param.pageSize,
              pageIndex: param.current,
              terms: {
                'id$in-dimension$role$not': props.data.id,
              },
            }),
          );
          return {
            result: { data: response.result.data },
            success: true,
            status: 200,
            total: response.result.total,
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
