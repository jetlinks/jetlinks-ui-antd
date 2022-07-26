import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import PermissionButton from '@/components/PermissionButton';
import usePermissions from '@/hooks/permission';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history } from 'umi';
import Service from '../service';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

export const service = new Service('network/certificate');

const Certificate = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const { permission } = usePermissions('link/Certificate');

  const { minHeight } = useDomFullHeight(`.link-certificate`, 24);

  const columns: ProColumns<CertificateItem>[] = [
    {
      dataIndex: 'type',
      title: '证书标准',
      render: (_, record: any) => <span>{record.type?.text || '-'}</span>,
      valueType: 'select',
      valueEnum: {
        common: {
          text: '国际标准',
          status: 'common',
        },
      },
    },
    {
      dataIndex: 'name',
      title: '证书名称',
      ellipsis: true,
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
      render: (text: any) => (
        <div style={{ width: '100%' }} className="ellipsis">
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 100,
      render: (text, record) => [
        <PermissionButton
          key={'update'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: '编辑',
          }}
          onClick={() => {
            const url = `${getMenuPathByParams(MENUS_CODE['link/Certificate/Detail'], record.id)}`;
            history.push(url);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'delete'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.delete}
          popConfirm={{
            title: '确认删除？',
            onConfirm: async () => {
              await service.remove(record.id);
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
          }}
          tooltip={{
            title: '删除',
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<CertificateItem>
        field={columns}
        target="certificate"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<CertificateItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        rowKey="id"
        tableClassName={'link-certificate'}
        columnEmptyText={''}
        tableStyle={{ minHeight }}
        headerTitle={
          <PermissionButton
            onClick={() => {
              const url = `${getMenuPathByParams(MENUS_CODE['link/Certificate/Detail'])}`;
              history.push(url);
            }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
    </PageContainer>
  );
};
export default Certificate;
