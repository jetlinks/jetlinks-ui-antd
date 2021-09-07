import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { SystemLogItem } from '@/pages/log/System/typings';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';
import BaseCrud from '@/components/BaseCrud';
import BaseService from '@/utils/BaseService';
import { CurdModel } from '@/components/BaseCrud/model';
import { EditOutlined } from '@ant-design/icons';

const service = new BaseService<SystemLogItem>('logger/system');
const System = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SystemLogItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.thread',
        defaultMessage:'线程',
      }),
      dataIndex: 'threadName',
      ellipsis: true,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.name',
        defaultMessage:'名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.level',
        defaultMessage:'级别',
      }),
      dataIndex: 'level',
      width: 80,
      render: (text) => <Tag color={text === 'ERROR' ? 'red' : 'orange'}>{text}</Tag>,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.logContent',
        defaultMessage:'日志内容',
      }),
      dataIndex: 'exceptionStack',
      ellipsis: true,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.serviceName',
        defaultMessage:'服务名',
      }),
      dataIndex: 'context.server',
      width: 150,
      ellipsis: true,
    },
    {
      title:intl.formatMessage({
        id:'pages.log.system.creationTime',
        defaultMessage:'创建时间',
      }),
      dataIndex: 'createTime',
      width: 200,
      sorter: true,
      ellipsis: true,
      defaultSortOrder: 'descend',
      renderText: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
      ],
    },
  ];
  return (
    <PageContainer>
      <BaseCrud<SystemLogItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.log.system',
          defaultMessage: '系统日志',
        })}
        schema={{}}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default System;
