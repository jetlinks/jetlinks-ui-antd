import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton } from '@/components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import { Space } from 'antd';
import ProTableCard from '@/components/ProTableCard';
import Save from './Save';

const Configuration = () => {
  const intl = useIntl();

  const columns: ProColumns<ConfigItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      title: '类型',
      dataIndex: 'targetType',
    },
    {
      title: '告警级别',
      dataIndex: 'level',
    },
    {
      title: '关联场景联动',
      dataIndex: 'sceneName',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        <PermissionButton
          isPermission={true}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          onClick={() => {
            console.log(record);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={true}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            }),
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const actionRef = useRef<ActionType>();

  const [param, setParam] = useState({});

  const [visible, setVisible] = useState<boolean>(false);
  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTableCard<ConfigItem>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={true}
              onClick={() => {
                setVisible(true);
              }}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              {intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              })}
            </PermissionButton>
          </Space>
        }
      />
      <Save visible={visible} close={() => setVisible(false)} />
    </PageContainer>
  );
};
export default Configuration;
