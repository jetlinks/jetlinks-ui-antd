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
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import { ProTableCard } from '@/components';
import RuleInstanceCard from '@/components/ProTableCard/CardItems/ruleInstance';
import Save from '@/pages/rule-engine/Instance/Save';
import SystemConst from '@/utils/const';

export const service = new Service('rule-engine/instance');

const Instance = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<InstanceItem>>({});
  const [searchParams, setSearchParams] = useState<any>({});

  const tools = (record: InstanceItem) => [
    <Tooltip
      title={intl.formatMessage({
        id: 'pages.data.option.edit',
        defaultMessage: '编辑',
      })}
      key={'edit'}
    >
      <Button
        type={'link'}
        style={{ padding: 0 }}
        onClick={() => {
          setCurrent(record);
          setVisible(true);
        }}
      >
        <EditOutlined />
      </Button>
    </Tooltip>,
    <Tooltip
      title={intl.formatMessage({
        id: 'pages.data.option.detail',
        defaultMessage: '查看',
      })}
      key={'detail'}
    >
      <Button
        type={'link'}
        style={{ padding: 0 }}
        onClick={() => {
          window.open(`/${SystemConst.API_BASE}/rule-editor/index.html#flow/${record.id}`);
        }}
      >
        <EyeOutlined />
      </Button>
    </Tooltip>,
    <Popconfirm
      key={'state'}
      title={intl.formatMessage({
        id: `pages.data.option.${record.state.value !== 'stopped' ? 'disabled' : 'enabled'}.tips`,
        defaultMessage: '确认禁用？',
      })}
      onConfirm={async () => {
        if (record.state.value !== 'stopped') {
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
          id: `pages.data.option.${record.state.value !== 'stopped' ? 'disabled' : 'enabled'}`,
          defaultMessage: record.state.value !== 'stopped' ? '禁用' : '启用',
        })}
      >
        <Button type={'link'} style={{ padding: 0 }}>
          {record.state.value !== 'stopped' ? <StopOutlined /> : <CheckCircleOutlined />}
        </Button>
      </Tooltip>
    </Popconfirm>,
    <Popconfirm
      title={record.state.value === 'stopped' ? '确认删除' : '未停止不能删除'}
      key={'delete'}
      onConfirm={async () => {
        if (record.state.value === 'stopped') {
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
        <Button type={'link'} style={{ padding: 0 }}>
          <DeleteOutlined />
        </Button>
      </Tooltip>
    </Popconfirm>,
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
      render: (text: any) => (
        <Badge color={text?.value === 'stopped' ? 'red' : 'green'} text={text?.text} />
      ),
      valueType: 'select',
      valueEnum: {
        started: {
          text: '已启动',
          status: 'started',
        },
        disable: {
          text: '已禁用',
          status: 'disable',
        },
        stopped: {
          text: '已停止',
          status: 'stopped',
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
        <a
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
        </a>,
        <a
          key={'see'}
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
        </a>,
        <Popconfirm
          key={'state'}
          title={intl.formatMessage({
            id: `pages.data.option.${
              record.state.value !== 'stopped' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          })}
          onConfirm={async () => {
            if (record.state.value !== 'stopped') {
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
              id: `pages.data.option.${record.state.value !== 'stopped' ? 'disabled' : 'enabled'}`,
              defaultMessage: record.state.value !== 'stopped' ? '禁用' : '启用',
            })}
          >
            <Button type={'link'} style={{ padding: 0 }}>
              {record.state.value !== 'stopped' ? <StopOutlined /> : <CheckCircleOutlined />}
            </Button>
          </Tooltip>
        </Popconfirm>,
        <Popconfirm
          title={record.state.value === 'stopped' ? '确认删除' : '未停止不能删除'}
          key={'delete'}
          onConfirm={async () => {
            if (record.state.value === 'stopped') {
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
            <Button type={'link'} style={{ padding: 0 }}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<InstanceItem>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          console.log(data);
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
        cardRender={(record) => <RuleInstanceCard {...record} actions={tools(record)} />}
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
