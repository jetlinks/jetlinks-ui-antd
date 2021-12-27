import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { CertificateItem } from '@/pages/link/Certificate/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { message, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { CurdModel } from '@/components/BaseCrud/model';

export const service = new BaseService<CertificateItem>('network/certificate');
const Certificate = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<CertificateItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'instance',
      title: intl.formatMessage({
        id: 'pages.link.type',
        defaultMessage: '类型',
      }),
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.table.describe',
        defaultMessage: '描述',
      }),
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
          key="edit"
          onClick={() => {
            CurdModel.update(record);
            CurdModel.model = 'edit';
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
        <a key="delete">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '确认删除？',
            })}
            onConfirm={async () => {
              await service.remove(record.id);
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
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <MinusOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      instance: {
        title: '类型',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        default: 'PEM',
        enum: [
          { label: 'PFX', value: 'PFX' },
          { label: 'JKS', value: 'JKS' },
          { label: 'PEM', value: 'PEM' },
        ],
      },
      configs: {
        type: 'object',
        properties: {
          '{url:keystoreBase64}': {
            title: '密钥库',
            'x-component': 'FUpload',
            'x-decorator': 'FormItem',
            'x-component-props': {
              type: 'file',
            },
          },
          keystorePwd: {
            title: '密钥库密码',
            'x-component': 'Password',
            'x-decorator': 'FormItem',
            'x-visible': false,
            'x-component-props': {
              style: {
                width: '100%',
              },
            },
            'x-reactions': {
              dependencies: ['..instance'],
              fulfill: {
                state: {
                  visible: '{{["JKS","PFX"].includes($deps[0])}}',
                },
              },
            },
          },
          '{url:trustKeyStoreBase64}': {
            title: '信任库',
            'x-component': 'FUpload',
            'x-decorator': 'FormItem',
            'x-component-props': {
              style: {
                width: '100px',
              },
              type: 'file',
            },
          },
          trustKeyStorePwd: {
            title: '信任库密码',
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'Password',
            'x-reactions': {
              dependencies: ['..instance'],
              fulfill: {
                state: {
                  visible: '{{["JKS","PFX"].includes($deps[0])}}',
                },
              },
            },
          },
        },
      },
      description: {
        title: '描述',
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.link.certificate',
          defaultMessage: '证书管理',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Certificate;
