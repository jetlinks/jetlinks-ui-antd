import BaseCrud from '@/components/BaseCrud';
import { CurdModel } from '@/components/BaseCrud/model';
import BaseService from '@/utils/BaseService';
import { CloseCircleOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { message, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import type { CtwingItem } from '@/pages/cloud/Ctwing/typings';
import { useIntl } from '@@/plugin-locale/localeExports';

export const service = new BaseService<CtwingItem>('ctwing/product');

const stateIconMap = {
  enabled: <CloseCircleOutlined />,
  disabled: <PlayCircleOutlined />,
};

const Ctwing = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<CtwingItem>[] = [
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
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      render: (value: any) => value.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      align: 'center',
      dataIndex: 'description',
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
        <a key="editable" onClick={() => CurdModel.update(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="status">
          <Popconfirm
            title={intl.formatMessage({
              id: `pages.data.option.${
                record.state.value === 'disabled' ? 'enabled' : 'disabled'
              }.tips`,
              defaultMessage: `确认${record.state.value === 'disabled' ? '启' : '禁'}用？`,
            })}
            onConfirm={async () => {
              // const state = record.state.value === 'disabled' ? 'enable' : 'disable';
              // await service.changeStatus(record.id, state);
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${
                  record.state.value === 'enabled' ? 'disabled' : 'enabled'
                }`,
                defaultMessage: record.state.text,
              })}
            >
              {stateIconMap[record.state.value]}
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];
  const schema = {};

  return (
    <PageContainer>
      <BaseCrud<CtwingItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.cloud.ctwing',
          defaultMessage: 'ctwing',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Ctwing;
