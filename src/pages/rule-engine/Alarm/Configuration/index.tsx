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
import Service from '@/pages/rule-engine/Alarm/Configuration/service';
import AlarmConfig from '@/components/ProTableCard/CardItems/AlarmConfig';

const service = new Service('alarm/config');

const Configuration = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);

  const [current, setCurrent] = useState<any>();
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
      renderText: (state) => state.text,
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
          style={{ padding: 0 }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          type="link"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          isPermission={true}
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除?',
            onConfirm: () => service.remove(record.id),
          }}
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

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTableCard<any>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        request={(params) => service.query(params)}
        gridColumn={3}
        cardRender={(record) => (
          <AlarmConfig
            {...record}
            actions={[
              <PermissionButton
                isPermission={true}
                key="edit"
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                popConfirm={{
                  title: '确认删除?',
                  onConfirm: async () => {
                    await service.remove(record.id);
                    actionRef.current?.reset?.();
                  },
                }}
                isPermission={true}
                key="delete"
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={true}
              onClick={() => {
                setCurrent(undefined);
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
      <Save data={current} visible={visible} close={() => setVisible(false)} />
    </PageContainer>
  );
};
export default Configuration;
