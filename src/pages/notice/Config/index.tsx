import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BarsOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { downloadObject } from '@/utils/util';
import Service from '@/pages/notice/Config/service';
import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history, useLocation } from 'umi';
import { model } from '@formily/reactive';
import moment from 'moment';
import { ProTableCard } from '@/components';
import NoticeConfig from '@/components/ProTableCard/CardItems/noticeConfig';
import Debug from '@/pages/notice/Config/Debug';
import Log from '@/pages/notice/Config/Log';

export const service = new Service('notifier/config');

export const state = model<{
  current?: ConfigItem;
  debug?: boolean;
  log?: boolean;
}>({
  debug: false,
  log: false,
});
const Config = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const location = useLocation<{ id: string }>();

  const id = (location as any).query?.id;

  const columns: ProColumns<ConfigItem>[] = [
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
      dataIndex: 'type',
      title: intl.formatMessage({
        id: 'pages.notice.config.type',
        defaultMessage: '通知方式',
      }),
    },
    {
      dataIndex: 'provider',
      title: intl.formatMessage({
        id: 'pages.table.provider',
        defaultMessage: '服务商',
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
          onClick={async () => {
            // setLoading(true);
            state.current = record;
            history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
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
        <a
          onClick={() =>
            downloadObject(
              record,
              `通知配置${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            )
          }
          key="download"
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
          key="record"
          onClick={() => {
            state.log = true;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.record',
              defaultMessage: '通知记录',
            })}
          >
            <BarsOutlined />
          </Tooltip>
        </a>,
        <a key="remove">
          <Popconfirm
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
            title="确认删除?"
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  // const getTypes = async () =>
  //   service.getTypes().then((resp) => {
  //     providerRef.current = resp.result;
  //     return resp.result.map((item: NetworkType) => ({
  //       label: item.name,
  //       value: item.id,
  //     }));
  //   });
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
      <ProTableCard<ConfigItem>
        search={false}
        params={param}
        columns={columns}
        headerTitle={'通知配置'}
        toolBarRender={() => [
          <Button
            onClick={() => {
              state.current = undefined;
              history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
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
        gridColumn={3}
        request={async (params) => service.query(params)}
        cardRender={(record) => (
          <NoticeConfig
            {...record}
            type={id}
            actions={[
              <Button
                key="edit"
                onClick={async () => {
                  // setLoading(true);
                  state.current = record;
                  history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
                }}
              >
                <EditOutlined />
                编辑
              </Button>,
              <Button
                key="debug"
                onClick={() => {
                  state.debug = true;
                }}
              >
                <BugOutlined />
                调试
              </Button>,
              <Button
                key="export"
                onClick={() =>
                  downloadObject(
                    record,
                    `通知配置${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
                  )
                }
              >
                <ArrowDownOutlined />
                导出
              </Button>,
              <Button
                key="log"
                onClick={() => {
                  state.log = true;
                }}
              >
                <UnorderedListOutlined />
                通知记录
              </Button>,
              <Popconfirm
                key="delete"
                title="确认删除？"
                onConfirm={async () => {
                  await service.remove(record.id);
                  actionRef.current?.reset?.();
                }}
              >
                <Button key="delete">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>,
            ]}
          />
        )}
      />
      <Debug />
      <Log />
    </PageContainer>
  );
});
export default Config;
