import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import Service from '@/pages/system/Relationship/service';
import { PageContainer } from '@ant-design/pro-layout';
import { PermissionButton } from '@/components';
import { useIntl } from 'umi';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Save from './Save';

export const service = new Service('relation');

const Relationship = () => {
  const intl = useIntl();
  const [param, setParam] = useState<any>({});
  const [current, setCurrent] = useState<Partial<ReationItem>>({});
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('system/Relationship');

  const columns: ProColumns<ReationItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
    },
    {
      dataIndex: 'objectTypeName',
      title: '关联方',
      ellipsis: true,
    },
    {
      dataIndex: 'targetTypeName',
      title: '被关联方',
      ellipsis: true,
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="warning"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除',
            onConfirm: async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              }
            },
          }}
          key="button"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<ReationItem>
        field={columns}
        target="relationship"
        onSearch={(data) => {
          actionRef.current?.reload();
          setParam(data);
        }}
      />
      <ProTable<ReationItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        rowKey="id"
        request={async (params) => {
          return service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] });
        }}
        headerTitle={[
          <PermissionButton
            isPermission={permission.add}
            key="add"
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            type="primary"
            tooltip={{
              title: intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              }),
            }}
          >
            新增
          </PermissionButton>,
        ]}
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Relationship;
