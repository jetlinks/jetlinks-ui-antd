import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
// import type { Field } from '@formily/core';
// import { onFieldValueChange } from '@formily/core';
import ProTable from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
// import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/notice/Template/service';
import ConfigService from '@/pages/notice/Config/service';
import SearchComponent from '@/components/SearchComponent';
// import Detail from '@/pages/notice/Template/Detail';
import { history, useLocation } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { model } from '@formily/reactive';
import Debug from './Debug';
import Log from '@/pages/notice/Template/Log';
import { downloadObject } from '@/utils/util';
import moment from 'moment';

export const service = new Service('notifier/template');

export const configService = new ConfigService('notifier/config');
export const state = model<{
  current?: TemplateItem;
  debug?: boolean;
  log?: boolean;
}>({
  debug: false,
  log: false,
});
const Template = () => {
  const intl = useIntl();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TemplateItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: intl.formatMessage({
        id: 'pages.notice.config.type',
        defaultMessage: '通知方式',
      }),
    },
    {
      dataIndex: 'description',
      title: '说明',
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
            state.current = record;
            history.push(getMenuPathByParams(MENUS_CODE['notice/Template/Detail'], id));
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
        <Popconfirm
          key="delete"
          title="确认删除？"
          onConfirm={async () => {
            await service.remove(record.id);
            actionRef.current?.reload();
          }}
        >
          <a key="delete">
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <DeleteOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
        <a
          key="download"
          onClick={() => {
            downloadObject(
              record,
              `${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            );
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a
          key="debug"
          onClick={() => {
            state.debug = true;
            state.current = record;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
        <a
          key="log"
          onClick={() => {
            state.log = true;
          }}
        >
          <Tooltip title="通知记录">
            <UnorderedListOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];

  const [param, setParam] = useState({});
  return (
    <PageContainer className={'page-title-show'}>
      <SearchComponent
        defaultParam={[{ column: 'type$IN', value: id }]}
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<TemplateItem>
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        headerTitle={intl.formatMessage({
          id: 'pages.notice.template',
          defaultMessage: '通知模版',
        })}
        toolBarRender={() => [
          <Button
            onClick={() => {
              state.current = undefined;
              history.push(getMenuPathByParams(MENUS_CODE['notice/Template/Detail'], id));
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
        request={async (params) => service.query(params)}
      />
      <Debug />
      <Log />
    </PageContainer>
  );
};
export default Template;
