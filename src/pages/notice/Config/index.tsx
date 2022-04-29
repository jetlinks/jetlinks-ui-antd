import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BarsOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { message, Space, Upload } from 'antd';
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
import { PermissionButton, ProTableCard } from '@/components';
import NoticeConfig from '@/components/ProTableCard/CardItems/noticeConfig';
import Debug from '@/pages/notice/Config/Debug';
import Log from '@/pages/notice/Config/Log';
import { typeList } from '@/components/ProTableCard/CardItems/noticeTemplate';
import usePermissions from '@/hooks/permission';
import SyncUser from '@/pages/notice/Config/SyncUser';

export const service = new Service('notifier/config');

export const state = model<{
  current?: ConfigItem;
  debug?: boolean;
  log?: boolean;
  syncUser: boolean;
}>({
  debug: false,
  log: false,
  syncUser: false,
});
const Config = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const location = useLocation<{ id: string }>();

  const { permission: configPermission } = usePermissions('notice');
  const id = (location as any).query?.id;

  const columns: ProColumns<ConfigItem>[] = [
    {
      dataIndex: 'name',
      title: '配置名称',
    },
    {
      dataIndex: 'provider',
      title: '通知方式',
      renderText: (text, record) => typeList[record.type][record.provider],
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
        (id === 'dingTalk' || id === 'weixin') && (
          <PermissionButton
            tooltip={{
              title: '同步用户',
            }}
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              state.syncUser = true;
              state.current = record;
            }}
          >
            <TeamOutlined />
          </PermissionButton>
        ),
        <PermissionButton
          key="edit"
          type="link"
          style={{ padding: 0 }}
          isPermission={configPermission.update}
          onClick={async () => {
            // setLoading(true);
            state.current = record;
            history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          style={{ padding: 0 }}
          isPermission={configPermission.export}
          onClick={() =>
            downloadObject(
              record,
              `通知配置${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            )
          }
          key="download"
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            }),
          }}
        >
          <ArrowDownOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          style={{ padding: 0 }}
          isPermission={configPermission.debug}
          key="debug"
          onClick={() => {
            state.debug = true;
            state.current = record;
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            }),
          }}
        >
          <BugOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          style={{ padding: 0 }}
          isPermission={configPermission.log}
          key="record"
          onClick={() => {
            state.log = true;
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.record',
              defaultMessage: '通知记录',
            }),
          }}
        >
          <BarsOutlined />
        </PermissionButton>,
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          popConfirm={{
            onConfirm: async () => {
              await service.remove(record.id);
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            },
            title: '确认删除',
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            }),
          }}
          key="remove"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const [param, setParam] = useState({});
  return (
    <PageContainer>
      <SearchComponent
        defaultParam={[{ column: 'type$IN', value: id }]}
        field={columns}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTableCard<ConfigItem>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        params={param}
        columns={columns}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={configPermission.add}
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
            </PermissionButton>
            <Upload
              disabled={!configPermission.import}
              key={'import'}
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = async (result) => {
                  const text = result.target?.result as string;
                  if (!file.type.includes('json')) {
                    message.warning('文件内容格式错误');
                    return;
                  }
                  try {
                    const data = JSON.parse(text || '{}');
                    const res: any = await service.savePatch(data);
                    if (res.status === 200) {
                      message.success('操作成功');
                      actionRef.current?.reload();
                    }
                  } catch {
                    message.warning('文件内容格式错误');
                  }
                };
                return false;
              }}
            >
              <PermissionButton isPermission={configPermission.import} style={{ marginLeft: 12 }}>
                导入
              </PermissionButton>
            </Upload>
            <PermissionButton
              popConfirm={{
                title: '确认导出当前页数据？',
                onConfirm: async () => {
                  const resp: any = await service.queryNoPagingPost({ ...param, paging: false });
                  if (resp.status === 200) {
                    downloadObject(resp.result, '通知配置数据');
                    message.success('导出成功');
                  } else {
                    message.error('导出错误');
                  }
                },
              }}
              isPermission={configPermission.export}
            >
              导出
            </PermissionButton>
          </Space>
        }
        gridColumn={3}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        cardRender={(record) => (
          <NoticeConfig
            {...record}
            type={id}
            detail={
              <div
                style={{ fontSize: 18, padding: 8 }}
                onClick={() => {
                  state.current = record;
                  history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
                }}
              >
                <EyeOutlined />
              </div>
            }
            actions={[
              (id === 'dingTalk' || id === 'weixin') && (
                <PermissionButton
                  key="syncUser"
                  isPermission={true}
                  type="link"
                  onClick={() => {
                    state.syncUser = true;
                    state.current = record;
                  }}
                >
                  <TeamOutlined />
                  同步用户
                </PermissionButton>
              ),
              <PermissionButton
                isPermission={configPermission.update}
                type={'link'}
                key="edit"
                onClick={async () => {
                  state.current = record;
                  history.push(getMenuPathByParams(MENUS_CODE['notice/Config/Detail'], id));
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                type={'link'}
                key="debug"
                isPermission={configPermission.debug}
                onClick={() => {
                  state.debug = true;
                  state.current = record;
                }}
              >
                <BugOutlined />
                调试
              </PermissionButton>,
              <PermissionButton
                type={'link'}
                key="export"
                isPermission={configPermission.export}
                onClick={() =>
                  downloadObject(
                    record,
                    `通知配置${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
                  )
                }
              >
                <ArrowDownOutlined />
                导出
              </PermissionButton>,
              <PermissionButton
                type={'link'}
                key="log"
                isPermission={configPermission.log}
                onClick={() => {
                  state.log = true;
                  state.current = record;
                }}
              >
                <UnorderedListOutlined />
                通知记录
              </PermissionButton>,

              <PermissionButton
                key="delete"
                isPermission={configPermission.delete}
                popConfirm={{
                  title: '确认删除？',
                  onConfirm: async () => {
                    await service.remove(record.id);
                    actionRef.current?.reset?.();
                  },
                }}
                type={'link'}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
      <Debug />
      {state.log && <Log />}
      {state.syncUser && <SyncUser />}
    </PageContainer>
  );
});
export default Config;
