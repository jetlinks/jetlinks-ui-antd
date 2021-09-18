import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import BaseCrud from '@/components/BaseCrud';
import { message, Popconfirm, Tooltip } from 'antd';
import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { CurdModel } from '@/components/BaseCrud/model';
import type { AliyunItem } from '@/pages/cloud/Aliyun/typings';

export const service = new BaseService<AliyunItem>('device/aliyun/bridge');

const stateIconMap = {
  enabled: <CloseCircleOutlined />,
  disabled: <PlayCircleOutlined />,
};

const Aliyun = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<AliyunItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '说明',
      align: 'center',
      dataIndex: 'description',
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
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
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
      <BaseCrud<AliyunItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.cloud.aliyun',
          defaultMessage: '阿里云',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Aliyun;
