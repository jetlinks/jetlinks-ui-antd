import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BarsOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { downloadObject } from '@/utils/util';
import { CurdModel } from '@/components/BaseCrud/model';
import Service from '@/pages/notice/Config/service';
import { createForm, onFieldValueChange } from '@formily/core';
import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import ProTable from '@jetlinks/pro-table';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history, useLocation } from 'umi';
import { model } from '@formily/reactive';
import moment from 'moment';

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
  const providerRef = useRef<NetworkType[]>([]);
  const oldTypeRef = useRef();
  const location = useLocation<{ id: string }>();

  const id = (location as any).query?.id;

  // const [configSchema, setConfigSchema] = useState<ISchema>({});
  // const [loading, setLoading] = useState<boolean>(false);
  const createSchema = async () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const DForm = form;
    if (!DForm?.values) return;
    DForm.setValuesIn('provider', DForm.values.provider);
  };

  const formEvent = () => {
    onFieldValueChange('type', async (field, f) => {
      const type = field.value;
      if (!type) return;
      f.setFieldState('provider', (state1) => {
        state1.value = undefined;
        state1.dataSource = providerRef.current
          .find((item) => type === item.id)
          ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
      });
    });
    onFieldValueChange('provider', async (field) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      currentType = field.value;
      await createSchema();
    });
  };

  const form = useMemo(
    () =>
      createForm({
        effects: formEvent,
        initialValues: CurdModel.current,
      }),
    [],
  );

  let currentType = form.values.provider;

  if (oldTypeRef.current !== currentType) {
    form.clearFormGraph('configuration.*'); // 回收字段模型
    form.deleteValuesIn('configuration.*');
  }

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
      <ProTable<ConfigItem>
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
        request={async (params) => service.query(params)}
      />
    </PageContainer>
  );
});
export default Config;
