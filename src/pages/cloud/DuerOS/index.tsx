import BaseService from '@/utils/BaseService';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import { Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { DuerOSItem } from '@/pages/cloud/DuerOS/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { PermissionButton, ProTableCard } from '@/components';
import DuerOSCard from '@/components/ProTableCard/CardItems/duerOs';

export const service = new BaseService<DuerOSItem>('dueros/product');
const DuerOS = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DuerOSItem>[] = [
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.applianceType',
        defaultMessage: '设备类型',
      }),
      dataIndex: 'applianceType',
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.manufacturerName',
        defaultMessage: '厂家名称',
      }),
      dataIndex: 'manufacturerName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.version',
        defaultMessage: '动作数量',
      }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a
          onClick={() => {
            console.log(record);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  // const schema = {};

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
        request={(params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        cardRender={(record) => (
          <DuerOSCard
            {...record}
            action={[
              <PermissionButton>
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                type="link"
                popConfirm={{
                  disabled: record.state?.value !== 'disabled',
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
                // setCurrent(undefined);
                // setVisible(true);
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
    </PageContainer>
  );
};
export default DuerOS;
