import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/react';
import { Badge, Card, message } from 'antd';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import SearchComponent from '@/components/SearchComponent';
import { service } from '@/pages/device/Firmware';
import styles from './index.less';
import { model } from '@formily/reactive';
import { useParams } from 'umi';
import Details from './Details/index';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';

const colorMap = new Map();
colorMap.set('waiting', '#FF9000');
colorMap.set('loading', '#4293FF');
colorMap.set('finish', '#24B276');
colorMap.set('error', '#F76F5D');
colorMap.set('canceled', '#999');

const state = model<{
  waiting: number;
  loading: number;
  finish: number;
  error: number;
  canceled: number;
  info: any;
}>({
  waiting: 0,
  loading: 0,
  finish: 0,
  error: 0,
  canceled: 0,
  info: {},
});

const Detail = observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const { minHeight } = useDomFullHeight(`.firmware-task-detail`, 24);
  const [param, setParam] = useState({});
  const params = useParams<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const { permission } = usePermissions('device/Firmware');

  const buttonImg = require('/public/images/firmware/button.png');

  const arr = [
    {
      key: 'waiting',
      name: '等待升级',
      img: require('/public/images/firmware/waiting.png'),
    },
    {
      key: 'loading',
      name: '升级中',
      img: require('/public/images/firmware/loading.png'),
    },
    {
      key: 'finish',
      name: '升级完成',
      img: require('/public/images/firmware/finish.png'),
    },
    {
      key: 'error',
      name: '升级失败',
      img: require('/public/images/firmware/error.png'),
    },
    {
      key: 'canceled',
      name: '已停止',
      img: require('/public/images/firmware/cancel.png'),
    },
  ];

  const statusMap = new Map();
  statusMap.set('waiting', 'warning');
  statusMap.set('processing', 'processing');
  statusMap.set('failed', 'error');
  statusMap.set('success', 'success');
  statusMap.set('canceled', 'default');

  // 等待升级
  const queryWaiting = async () => {
    const resp = await service.historyCount({
      terms: [
        {
          terms: [
            { column: 'taskId', value: params.id },
            { column: 'state', value: 'waiting' },
          ],
        },
      ],
    });
    if (resp.status === 200) {
      state.waiting = resp?.result || 0;
    }
  };
  // 升级中
  const queryProcessing = async () => {
    const resp = await service.historyCount({
      terms: [
        {
          terms: [
            { column: 'taskId', value: params.id },
            { column: 'state', value: 'processing' },
          ],
        },
      ],
    });
    if (resp.status === 200) {
      state.loading = resp?.result || 0;
    }
  };
  // 升级失败
  const queryFailed = async () => {
    const resp = await service.historyCount({
      terms: [
        {
          terms: [
            { column: 'taskId', value: params.id },
            { column: 'state', value: 'failed' },
          ],
        },
      ],
    });
    if (resp.status === 200) {
      state.error = resp?.result || 0;
    }
  };
  // 升级完成
  const querySuccess = async () => {
    const resp = await service.historyCount({
      terms: [
        {
          terms: [
            { column: 'taskId', value: params.id },
            { column: 'state', value: 'success' },
          ],
        },
      ],
    });
    if (resp.status === 200) {
      state.finish = resp?.result || 0;
    }
  };

  const queryCancel = async () => {
    const resp = await service.historyCount({
      terms: [
        {
          terms: [
            { column: 'taskId', value: params.id },
            { column: 'state', value: 'canceled' },
          ],
        },
      ],
    });
    if (resp.status === 200) {
      state.canceled = resp?.result || 0;
    }
  };

  const handleSearch = () => {
    queryWaiting();
    queryProcessing();
    querySuccess();
    queryFailed();
    queryCancel();
  };

  useEffect(() => {
    service.taskById(params.id).then((resp) => {
      if (resp.status === 200) {
        state.info = resp.result;
      }
    });
    handleSearch();
  }, [params.id]);

  const columns: ProColumns<FirmwareItem>[] = [
    {
      title: '设备名称',
      ellipsis: true,
      dataIndex: 'deviceName',
    },
    {
      title: '所属产品',
      ellipsis: true,
      dataIndex: 'productId',
      valueType: 'select',
      hideInSearch: true,
      render: (text: any, record: any) => record?.productName,
      request: async () => {
        const res: any = await service.queryProduct({
          paging: false,
          sorts: [{ name: 'name', order: 'desc' }],
        });
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
    },
    {
      title: '创建时间',
      ellipsis: true,
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      // render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      ellipsis: true,
      dataIndex: 'completeTime',
      valueType: 'dateTime',
      // render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '进度',
      ellipsis: true,
      dataIndex: 'progress',
      valueType: 'digit',
    },
    {
      title: '状态',
      ellipsis: true,
      dataIndex: 'state',
      render: (text: any, record: any) =>
        record?.state ? (
          <Badge status={statusMap.get(record?.state?.value)} text={record?.state?.text} />
        ) : (
          ''
        ),
      valueType: 'select',
      valueEnum: {
        waiting: {
          text: '等待升级',
          status: 'waiting',
        },
        processing: {
          text: '升级中',
          status: 'processing',
        },
        failed: {
          text: '升级失败',
          status: 'failed',
        },
        success: {
          text: '升级成功',
          status: 'success',
        },
        canceled: {
          text: '已停止',
          status: 'canceled',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (text: any, record: any) =>
        record?.state?.value === 'failed'
          ? [
              // <a
              //   onClick={() => {
              //     setVisible(true);
              //     setReason(record?.errorReason || '');
              //   }}
              //   key="link"
              // >
              //   <Tooltip
              //     title={intl.formatMessage({
              //       id: 'pages.data.option.detail',
              //       defaultMessage: '查看',
              //     })}
              //     key={'detail'}
              //   >
              //     <SearchOutlined />
              //   </Tooltip>
              // </a>,
              <PermissionButton
                key="link"
                type={'link'}
                style={{ padding: 0 }}
                isPermission={permission.update}
                tooltip={{
                  title: '重试',
                }}
                onClick={() => {
                  setVisible(true);
                  setReason(record?.errorReason || '');
                }}
              >
                <SearchOutlined />
              </PermissionButton>,
              <>
                {state.info?.mode?.value === 'push' ? (
                  <PermissionButton
                    key="patch"
                    type={'link'}
                    style={{ padding: 0 }}
                    isPermission={permission.update}
                    tooltip={{
                      title: '重试',
                    }}
                    popConfirm={{
                      title: '确认重试',
                      onConfirm: async () => {
                        const resp = await service.startOneTask([record.id]);
                        if (resp.status === 200) {
                          message.success('操作成功！');
                          handleSearch();
                          actionRef.current?.reload?.();
                        }
                      },
                    }}
                  >
                    <RedoOutlined />
                  </PermissionButton>
                ) : // <Popconfirm
                //   key="refresh"
                //   onConfirm={async () => {
                //     const resp = await service.startOneTask([record.id]);
                //     if (resp.status === 200) {
                //       message.success('操作成功！');
                //       handleSearch();
                //       actionRef.current?.reload?.();
                //     }
                //   }}
                //   title={'确认重试'}
                // >
                //   <a>
                //     <Tooltip title={'重试'} key={'refresh'}>
                //       <RedoOutlined />
                //     </Tooltip>
                //   </a>
                // </Popconfirm>
                null}
              </>,
            ]
          : [],
    },
  ];

  return (
    <PageContainer>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 24 }}>
          {arr.map((item) => (
            <div key={item.key}>
              <div className={styles.firmwareDetailCard}>
                <div className={styles.firmwareDetailCardHeader}>
                  <div className={styles.firmwareDetailCardTitle}>
                    <Badge color={colorMap.get(item.key)} style={{ marginRight: 5 }} />
                    {item.name}
                  </div>
                  <div className={styles.firmwareDetailCardRight}>
                    {item.key === 'error' && state.info?.mode?.value === 'push' && (
                      // <Popconfirm
                      //   title="确认批量重试"
                      //   onConfirm={async () => {
                      //     const resp = await service.startTask(params.id, ['failed']);
                      //     if (resp.status === 200) {
                      //       message.success('操作成功！');
                      //       queryFailed();
                      //       actionRef.current?.reload?.();
                      //     }
                      //   }}
                      // >
                      //   <a>批量重试</a>
                      // </Popconfirm>
                      <PermissionButton
                        key="patch"
                        type={'link'}
                        style={{ padding: 0 }}
                        isPermission={permission.update}
                        tooltip={{
                          title: '批量重试',
                        }}
                        popConfirm={{
                          title: '确认批量重试',
                          onConfirm: async () => {
                            const resp = await service.startTask(params.id, ['failed']);
                            if (resp.status === 200) {
                              message.success('操作成功！');
                              queryFailed();
                              actionRef.current?.reload?.();
                            }
                          },
                        }}
                      >
                        批量重试
                      </PermissionButton>
                    )}
                    <PermissionButton
                      key="patch1"
                      style={{ padding: 0, backgroundColor: 'inherit', border: 0 }}
                      isPermission={permission.update}
                      onClick={() => {
                        if (item.key === 'waiting') {
                          queryWaiting();
                        } else if (item.key === 'finish') {
                          querySuccess();
                        } else if (item.key === 'loading') {
                          queryProcessing();
                        } else if (item.key === 'canceled') {
                          queryCancel();
                        } else {
                          queryFailed();
                        }
                      }}
                    >
                      <div className={styles.firmwareDetailCardRefresh}>
                        <img style={{ width: '100%' }} src={buttonImg} />
                      </div>
                    </PermissionButton>
                  </div>
                </div>
                <div
                  className={styles.firmwareDetailCardNum}
                  style={{ color: colorMap.get(item.key) }}
                >
                  {state[item.key]}
                </div>
                <div className={styles.firmwareDetailCardImg}>
                  <img style={{ width: '100%' }} src={item.img} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <SearchComponent<FirmwareItem>
        field={columns}
        target="firmware-task-detail"
        defaultParam={[{ column: 'taskId', value: params?.id }]}
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<FirmwareItem>
        scroll={{ x: 1366 }}
        tableClassName={'firmware-task-detail'}
        tableStyle={{ minHeight }}
        search={false}
        columnEmptyText={''}
        params={param}
        request={async (params1) =>
          service.history({ ...params1, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        columns={columns}
        actionRef={actionRef}
      />
      {visible && (
        <Details
          data={reason}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
});
export default Detail;
