import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import { message, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useRef } from 'react';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import { EditOutlined, EyeOutlined, MinusOutlined } from '@ant-design/icons';
import { CurdModel } from '@/components/BaseCrud/model';

const service = new BaseService('firmware');

const Firmware = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<FirmwareItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.name',
        defaultMessage: '固件名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.version',
        defaultMessage: '固件版本',
      }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.products',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.signature',
        defaultMessage: '签名方式',
      }),
      dataIndex: 'signMethod',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.creationTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
      width: '200px',
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
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
            // router.push(`/device/firmware/save/${record.id}`);
          }}
        >
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
        <a>
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

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud<FirmwareItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.device.firmware',
          defaultMessage: '固件升级',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Firmware;
