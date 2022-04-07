// 视频设备列表
import { PageContainer } from '@ant-design/pro-layout';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import {
  ArrowDownOutlined,
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { DeviceItem } from '@/pages/media/Device/typings';
import { useIntl, useHistory } from 'umi';
import { BadgeStatus, ProTableCard } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import SearchComponent from '@/components/SearchComponent';
import MediaDevice from '@/components/ProTableCard/CardItems/mediaDevice';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import Service from './service';
import Save from './Save';

export const service = new Service('media/device');

const Device = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<DeviceItem>();
  const [queryParam, setQueryParam] = useState({});
  const history = useHistory<Record<string, string>>();

  const columns: ProColumns<DeviceItem>[] = [
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
    // {
    //   dataIndex: 'transport',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.transport',
    //     defaultMessage: '信令传输',
    //   }),
    // },
    // {
    //   dataIndex: 'streamMode',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.streamMode',
    //     defaultMessage: '流传输模式',
    //   }),
    // },
    // {
    //   dataIndex: 'channelNumber',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.channelNumber',
    //     defaultMessage: '通道数',
    //   }),
    // },
    // {
    //   dataIndex: 'host',
    //   title: 'IP',
    // },
    // {
    //   dataIndex: '端口',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.port',
    //     defaultMessage: '端口',
    //   }),
    // },
    // {
    //   dataIndex: 'manufacturer',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.manufacturer',
    //     defaultMessage: '设备厂家',
    //   }),
    // },
    // {
    //   dataIndex: 'model',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.model',
    //     defaultMessage: '型号',
    //   }),
    // },
    // {
    //   dataIndex: 'firmware',
    //   title: intl.formatMessage({
    //     id: 'pages.media.device.firmware',
    //     defaultMessage: '固件版本',
    //   }),
    // },
    // {
    //   dataIndex: 'networkType',
    //   title: intl.formatMessage({
    //     id: 'pages.table.type',
    //     defaultMessage: '类型',
    //   }),
    // },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (_, record) => (
        <BadgeStatus
          status={record.state.value}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.processing,
          }}
          text={record.state.text}
        />
      ),
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
        <a onClick={() => console.log(record)}>
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
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setQueryParam(data);
  };

  const deleteItem = async (id: string) => {
    const response: any = await service.remove(id);
    if (response.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功!',
        }),
      );
    }
    actionRef.current?.reload();
  };

  return (
    <PageContainer>
      <SearchComponent field={columns} onSearch={searchFn} />
      <ProTableCard<DeviceItem>
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        params={queryParam}
        request={(params = {}) =>
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
        headerTitle={[
          <Button
            onClick={() => {
              setCurrent(undefined);
              setVisible(true);
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
        cardRender={(record) => (
          <MediaDevice
            {...record}
            detail={
              <div
                style={{ fontSize: 18, padding: 8 }}
                onClick={() => {
                  history.push(
                    `${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], record.id)}`,
                  );
                }}
              >
                <EyeOutlined />
              </div>
            }
            actions={[
              <Button
                key="edit"
                onClick={() => {
                  setCurrent(record);
                  setVisible(true);
                }}
                type={'link'}
                style={{ padding: 0 }}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </Button>,
              <Button key={'viewChannel'}>查看通道</Button>,
              <Button key={'updateChannel'} disabled={record.state.value === 'offline'}>
                <SyncOutlined />
                更新通道
              </Button>,
              <Popconfirm
                key="delete"
                title={intl.formatMessage({
                  id:
                    record.state.value === 'offline'
                      ? 'pages.device.productDetail.deleteTip'
                      : 'page.table.isDelete',
                  defaultMessage: '是否删除?',
                })}
                onConfirm={async () => {
                  if (record.state.value !== 'offline') {
                    await deleteItem(record.id);
                  } else {
                    message.error('在线设备不能进行删除操作');
                  }
                }}
              >
                <Button
                  type={'link'}
                  style={{ padding: 0 }}
                  disabled={record.state.value !== 'offline'}
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>,
            ]}
          />
        )}
      />
      <Save
        model={!current ? 'add' : 'edit'}
        data={current}
        close={() => {
          setVisible(false);
        }}
        reload={() => {
          actionRef.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
};
export default Device;
