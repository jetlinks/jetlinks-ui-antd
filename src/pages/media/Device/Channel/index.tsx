// 视频设备通道列表
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import './index.less';
import { useRef, useState } from 'react';
import { ChannelItem } from '@/pages/media/Device/Channel/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Button, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import Service from './service';

export const service = new Service('media/device');

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [queryParam, setQueryParam] = useState({});
  const [, setVisible] = useState<boolean>(false);
  const [, setCurrent] = useState<ChannelItem>();

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setQueryParam(data);
  };

  const columns: ProColumns<ChannelItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'manufacturer',
      title: intl.formatMessage({
        id: 'pages.media.device.manufacturer',
        defaultMessage: '设备厂家',
      }),
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (_, record) => (
        <BadgeStatus
          status={record.status}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
            notActive: StatusColorEnum.processing,
          }}
          text={record.status}
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
      render: () => [
        <Tooltip
          key="edit"
          title={intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
        >
          <a onClick={() => {}}>
            <EditOutlined />
          </a>
        </Tooltip>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div className={'device-channel-warp'}>
        <div className={'left'}></div>
        <div className={'right'}>
          <SearchComponent field={columns} onSearch={searchFn} />
          <ProTable<ChannelItem>
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
          />
        </div>
      </div>
    </PageContainer>
  );
};
