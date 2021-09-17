import BaseService from '@/utils/BaseService';
import type {ProColumns, ActionType} from '@jetlinks/pro-table';
import {useIntl} from '@@/plugin-locale/localeExports';
import {PageContainer} from '@ant-design/pro-layout';
import BaseCrud from '@/components/BaseCrud';
import {useRef} from 'react';
import {Tooltip} from 'antd';
import {EditOutlined, MinusOutlined} from '@ant-design/icons';

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
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'applianceType',
    },
    {
      title: '厂商名称',
      dataIndex: 'manufacturerName',
    },
    {
      title: '动作数量',
      dataIndex: 'version',
    },
    {
      title: '操作',
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
            <EditOutlined/>
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined/>
          </Tooltip>
        </a>,
      ],
    },
  ];
  const schema = {};

  return (
    <PageContainer>
      <BaseCrud<DuerOSItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.cloud.duerOS',
          defaultMessage: 'DuerOS',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default DuerOS;

