import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { message, Space, Upload } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import Service from '@/pages/notice/Template/service';
import ConfigService from '@/pages/notice/Config/service';
import SearchComponent from '@/components/SearchComponent';
import { history, useLocation } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { model } from '@formily/reactive';
import Debug from './Debug';
import Log from '@/pages/notice/Template/Log';
import { downloadObject } from '@/utils/util';
import moment from 'moment';
import { PermissionButton, ProTableCard } from '@/components';
import NoticeCard, { typeList } from '@/components/ProTableCard/CardItems/noticeTemplate';
import { observer } from '@formily/react';
import usePermissions from '@/hooks/permission';

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

const list = {
  weixin: {
    corpMessage: {
      text: '企业消息',
      status: 'corpMessage',
    },
    officialMessage: {
      text: '服务号消息',
      status: 'officialMessage',
    },
  },
  dingTalk: {
    dingTalkMessage: {
      text: '钉钉消息',
      status: 'dingTalkMessage',
    },
    dingTalkRobotWebHook: {
      text: '群机器人消息',
      status: 'dingTalkRobotWebHook',
    },
  },
  voice: {
    aliyun: {
      text: '阿里云语音',
      status: 'aliyun',
    },
  },
  sms: {
    aliyunSms: {
      text: '阿里云短信',
      status: 'aliyunSms',
    },
  },
  email: {
    embedded: {
      text: '默认',
      status: 'embedded',
    },
  },
  webhook: {
    http: {
      text: 'Webhook',
      status: 'http',
    },
  },
};

const Template = observer(() => {
  const intl = useIntl();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;
  const actionRef = useRef<ActionType>();

  const { permission: templatePermission } = usePermissions('notice');

  const columns: ProColumns<TemplateItem>[] = [
    {
      dataIndex: 'name',
      title: '模版名称',
      ellipsis: true,
    },
    {
      dataIndex: 'provider',
      title: '通知方式',
      renderText: (text, record) => typeList[record.type][record.provider],
      valueType: 'select',
      valueEnum: list[id],
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
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
        <PermissionButton
          key="edit"
          style={{ padding: 0 }}
          type="link"
          isPermission={templatePermission.update}
          onClick={() => {
            state.current = record;
            history.push(getMenuPathByParams(MENUS_CODE['notice/Template/Detail'], id));
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
          key="download"
          style={{ padding: 0 }}
          type="link"
          tooltip={{ title: '导出' }}
          isPermission={templatePermission.export}
          onClick={() => {
            downloadObject(
              record,
              `${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            );
          }}
        >
          <ArrowDownOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={templatePermission.debug}
          key="debug"
          style={{ padding: 0 }}
          type="link"
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
          isPermission={templatePermission.log}
          key="log"
          style={{ padding: 0 }}
          type="link"
          onClick={() => {
            state.log = true;
          }}
          tooltip={{ title: '通知记录' }}
        >
          <UnorderedListOutlined />
        </PermissionButton>,
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          popConfirm={{
            title: '确认删除?',
            onConfirm: async () => {
              await service.remove(record.id);
              actionRef.current?.reload();
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            }),
          }}
          isPermission={templatePermission.delete}
          key="delete"
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
      <ProTableCard<TemplateItem>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        params={param}
        columns={columns}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={templatePermission.add}
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
            </PermissionButton>
            <Upload
              disabled={!templatePermission.import}
              key={'import'}
              accept=".json"
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
              <PermissionButton isPermission={templatePermission.import} style={{ marginLeft: 12 }}>
                导入
              </PermissionButton>
            </Upload>

            <PermissionButton
              popConfirm={{
                title: '确认导出当前页数据？',
                onConfirm: async () => {
                  const resp: any = await service.queryNoPagingPost({ ...param, paging: false });
                  if (resp.status === 200) {
                    downloadObject(resp.result, '通知模版数据');
                    message.success('导出成功');
                  } else {
                    message.error('导出错误');
                  }
                },
              }}
              isPermission={templatePermission.export}
            >
              导出
            </PermissionButton>
          </Space>
        }
        gridColumn={3}
        cardRender={(record) => (
          <NoticeCard
            {...record}
            type={id}
            detail={
              <div
                style={{ fontSize: 18, padding: 8 }}
                onClick={() => {
                  state.current = record;
                  history.push(getMenuPathByParams(MENUS_CODE['notice/Template/Detail'], id));
                }}
              >
                <EyeOutlined />
              </div>
            }
            actions={[
              <PermissionButton
                isPermission={templatePermission.update}
                key="edit"
                onClick={() => {
                  state.current = record;
                  history.push(getMenuPathByParams(MENUS_CODE['notice/Template/Detail'], id));
                }}
              >
                <EditOutlined />
                编辑
              </PermissionButton>,
              <PermissionButton
                isPermission={templatePermission.debug}
                key="debug"
                onClick={() => {
                  state.debug = true;
                  state.current = record;
                }}
              >
                <BugOutlined />
                调试
              </PermissionButton>,
              <PermissionButton
                key="export"
                isPermission={templatePermission.export}
                onClick={() => {
                  downloadObject(
                    record,
                    `${record.name}-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
                  );
                }}
              >
                <ArrowDownOutlined />
                导出
              </PermissionButton>,
              <PermissionButton
                isPermission={templatePermission.log}
                key="log"
                onClick={() => {
                  state.log = true;
                  state.current = record;
                }}
              >
                <UnorderedListOutlined />
                通知记录
              </PermissionButton>,
              <PermissionButton
                popConfirm={{
                  title: '确认删除?',
                  onConfirm: async () => {
                    await service.remove(record.id);
                    actionRef.current?.reset?.();
                  },
                }}
                isPermission={templatePermission.delete}
                key="delete"
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
      <Debug />
      {state.log && <Log />}
    </PageContainer>
  );
});
export default Template;
