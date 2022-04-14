import { PageContainer } from '@ant-design/pro-layout';
import Service from '@/pages/rule-engine/Instance/serivce';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { BadgeStatus, ProTableCard } from '@/components';
import RuleInstanceCard from '@/components/ProTableCard/CardItems/ruleInstance';
import Save from '@/pages/rule-engine/Instance/Save';
import SystemConst from '@/utils/const';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { getButtonPermission } from '@/utils/menu';

export const service = new Service('rule-engine/instance');

const Instance = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<InstanceItem>>({});
  const [searchParams, setSearchParams] = useState<any>({});

  const tools = (record: InstanceItem) => [
    <Button
      key={'edit'}
      type={'link'}
      style={{ padding: 0 }}
      onClick={() => {
        setCurrent(record);
        setVisible(true);
      }}
      disabled={getButtonPermission('rule-engine/Instance', ['update'])}
    >
      <Tooltip
        title={intl.formatMessage({
          id: 'pages.data.option.edit',
          defaultMessage: '编辑',
        })}
        key={'edit'}
      >
        <EditOutlined />
        编辑
      </Tooltip>
    </Button>,
    // <Button key={'view'}
    //   disabled={getButtonPermission('rule-engine/Instance', ['view'])}
    //   type={'link'}
    //   style={{ padding: 0 }}
    //   onClick={() => {
    //     window.open(`/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`);
    //   }}
    // >
    //   <Tooltip
    //     title={intl.formatMessage({
    //       id: 'pages.data.option.detail',
    //       defaultMessage: '查看',
    //     })}
    //     key={'detail'}
    //   >
    //     <EyeOutlined />
    //   </Tooltip>
    // </Button>,
    <Button
      key={'operate'}
      disabled={getButtonPermission('rule-engine/Instance', ['action'])}
      type={'link'}
      style={{ padding: 0 }}
    >
      <Popconfirm
        key={'state'}
        title={intl.formatMessage({
          id: `pages.data.option.${record.state.value !== 'disable' ? 'disabled' : 'enabled'}.tips`,
          defaultMessage: '确认禁用？',
        })}
        onConfirm={async () => {
          if (record.state.value !== 'disable') {
            await service.stopRule(record.id);
          } else {
            await service.startRule(record.id);
          }
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
            id: `pages.data.option.${record.state.value !== 'disable' ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state.value !== 'disable' ? '禁用' : '启用',
          })}
        >
          {record.state.value !== 'disable' ? (
            <span>
              <StopOutlined />
              禁用
            </span>
          ) : (
            <span>
              <CheckCircleOutlined />
              启用
            </span>
          )}
        </Tooltip>
      </Popconfirm>
    </Button>,
    <Button
      type={'link'}
      key={'delete'}
      style={{ padding: 0 }}
      disabled={getButtonPermission('rule-engine/Instance', ['delete'])}
    >
      <Popconfirm
        title={record.state.value === 'disable' ? '确认删除' : '未停止不能删除'}
        key={'delete'}
        onConfirm={async () => {
          if (record.state.value === 'disable') {
            await service.remove(record.id);
            message.success(
              intl.formatMessage({
                id: 'pages.data.option.success',
                defaultMessage: '操作成功!',
              }),
            );
            actionRef.current?.reload();
          } else {
            message.error('未停止不能删除');
          }
        }}
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
    </Button>,
  ];

  const columns: ProColumns<InstanceItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text: any, record: any) => (
        <BadgeStatus
          status={record.state?.value}
          text={record.state?.text}
          statusNames={{
            started: StatusColorEnum.success,
            disable: StatusColorEnum.error,
          }}
        />
      ),
      valueType: 'select',
      valueEnum: {
        started: {
          text: '正常',
          status: 'started',
        },
        disable: {
          text: '禁用',
          status: 'disable',
        },
      },
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
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('rule-engine/Instance', ['update'])}
          key={'edit'}
          onClick={() => {
            setCurrent(record);
            setVisible(true);
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
        </Button>,
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={getButtonPermission('rule-engine/Instance', ['view'])}
          key={'view'}
          onClick={() => {
            window.open(`/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.detail',
              defaultMessage: '查看',
            })}
          >
            <EyeOutlined />
          </Tooltip>
        </Button>,
        <Button
          type={'link'}
          style={{ padding: 0 }}
          key={'operate'}
          disabled={getButtonPermission('rule-engine/Instance', ['action'])}
        >
          <Popconfirm
            key={'state'}
            title={intl.formatMessage({
              id: `pages.data.option.${
                record.state.value !== 'disable' ? 'disabled' : 'enabled'
              }.tips`,
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              if (record.state.value !== 'disable') {
                await service.stopRule(record.id);
              } else {
                await service.startRule(record.id);
              }
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
                  record.state.value !== 'disable' ? 'disabled' : 'enabled'
                }`,
                defaultMessage: record.state.value !== 'disable' ? '禁用' : '正常',
              })}
            >
              {record.state.value !== 'disable' ? <StopOutlined /> : <CheckCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </Button>,
        <Button
          disabled={getButtonPermission('rule-engine/Instance', ['delete'])}
          type={'link'}
          key={'delete'}
          style={{ padding: 0 }}
        >
          <Popconfirm
            title={record.state.value === 'disable' ? '确认删除' : '未禁用不能删除'}
            key={'delete'}
            onConfirm={async () => {
              if (record.state.value === 'disable') {
                await service.remove(record.id);
                message.success(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              } else {
                message.error('未禁用不能删除');
              }
            }}
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
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<InstanceItem>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <ProTableCard<InstanceItem>
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <Button
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            disabled={getButtonPermission('rule-engine/Instance', ['add'])}
            style={{ marginRight: 12 }}
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
        cardRender={(record) => (
          <RuleInstanceCard
            {...record}
            actions={tools(record)}
            detail={
              <div
                style={{ padding: 8, fontSize: 24 }}
                onClick={() => {
                  if (!getButtonPermission('rule-engine/Instance', ['view'])) {
                    window.open(
                      `/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`,
                    );
                  }
                }}
              >
                <EyeOutlined />
              </div>
            }
          />
        )}
      />
      {visible && (
        <Save
          data={current}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Instance;
