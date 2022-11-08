import { observer } from '@formily/react';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { useEffect, useState } from 'react';
import { useDomFullHeight } from '@/hooks';
import service from '@/pages/link/DataCollect/service';
import CollectorCard from '@/components/ProTableCard/CardItems/DataCollect/device';
import { Empty, PermissionButton } from '@/components';
import { useIntl } from '@@/plugin-locale/localeExports';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';
import { Card, Col, Pagination, Row } from 'antd';
import { model } from '@formily/reactive';
import Save from '@/pages/link/DataCollect/components/Device/Save/index';

interface Props {
  type: boolean; // true: 综合查询  false: 数据采集
  id?: any;
  provider?: 'OPC_UA' | 'MODBUS_TCP';
  reload?: () => void;
}

const CollectorModel = model<{
  visible: boolean;
  current: Partial<CollectorItem>;
}>({
  visible: false,
  current: {},
});

export default observer((props: Props) => {
  const { minHeight } = useDomFullHeight(`.data-collect-collector`, 24);
  const [param, setParam] = useState({ pageSize: 12, terms: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const intl = useIntl();
  const { permission } = PermissionButton.usePermission('link/DataCollect/DataGathering');
  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 12,
    pageIndex: 0,
    total: 0,
  });

  const columns: ProColumns<CollectorItem>[] = props.type
    ? [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '通讯协议',
          dataIndex: 'provider',
          valueType: 'select',
          valueEnum: {
            OPC_UA: {
              text: 'OPC_UA',
              status: 'OPC_UA',
            },
            MODBUS_TCP: {
              text: 'MODBUS_TCP',
              status: 'MODBUS_TCP',
            },
          },
        },
        {
          title: '状态',
          dataIndex: 'state',
          valueType: 'select',
          valueEnum: {
            enabled: {
              text: '正常',
              status: 'enabled',
            },
            disabled: {
              text: '禁用',
              status: 'disabled',
            },
          },
        },
        {
          title: '说明',
          dataIndex: 'description',
        },
      ]
    : [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '状态',
          dataIndex: 'state',
          valueType: 'select',
          valueEnum: {
            enabled: {
              text: '正常',
              status: 'enabled',
            },
            disabled: {
              text: '禁用',
              status: 'disabled',
            },
          },
        },
        {
          title: '说明',
          dataIndex: 'description',
        },
      ];
  const handleSearch = (params: any) => {
    setLoading(true);
    setParam(params);
    service
      .queryCollector({
        ...params,
        terms: [
          ...params?.terms,
          {
            terms: [{ column: 'channelId', value: props?.id }],
          },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [props.id]);

  return (
    <div>
      <SearchComponent<CollectorItem>
        field={columns}
        target="data-collect-collector"
        onSearch={(data) => {
          const dt = {
            pageSize: 12,
            terms: [...data?.terms],
          };
          handleSearch(dt);
        }}
      />
      <Card bordered={false} loading={loading}>
        <div style={{ minHeight, position: 'relative' }}>
          <div style={{ paddingBottom: 48, height: '100%' }}>
            {!props.type && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <PermissionButton
                  isPermission={permission.add}
                  onClick={() => {
                    CollectorModel.current = {};
                    CollectorModel.visible = true;
                  }}
                  key="button"
                  type="primary"
                >
                  新增
                </PermissionButton>
              </div>
            )}
            {dataSource?.data.length ? (
              <>
                <Row gutter={[18, 18]} style={{ marginTop: 10 }}>
                  {(dataSource?.data || []).map((record: any) => (
                    <Col key={record.id} span={props.type ? 8 : 12}>
                      <CollectorCard
                        {...record}
                        actions={[
                          <PermissionButton
                            type={'link'}
                            onClick={() => {
                              CollectorModel.current = { ...record };
                              CollectorModel.visible = true;
                            }}
                            key={'edit'}
                            isPermission={permission.update}
                          >
                            <EditOutlined />
                            {intl.formatMessage({
                              id: 'pages.data.option.edit',
                              defaultMessage: '编辑',
                            })}
                          </PermissionButton>,
                          <PermissionButton
                            key={'action'}
                            type={'link'}
                            style={{ padding: 0 }}
                            isPermission={permission.action}
                            popConfirm={{
                              title: intl.formatMessage({
                                id: `pages.data.option.${
                                  record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                                }.tips`,
                                defaultMessage: '确认禁用？',
                              }),
                              onConfirm: async () => {
                                const resp =
                                  record?.state?.value !== 'disabled'
                                    ? await service.updateCollector(record.id, {
                                        state: 'disabled',
                                      })
                                    : await service.updateCollector(record.id, {
                                        state: 'enabled',
                                      });
                                if (resp.status === 200) {
                                  onlyMessage('操作成功！');
                                  handleSearch(param);
                                } else {
                                  onlyMessage('操作失败！', 'error');
                                }
                              },
                            }}
                          >
                            {record?.state?.value !== 'disabled' ? (
                              <StopOutlined />
                            ) : (
                              <PlayCircleOutlined />
                            )}
                            {intl.formatMessage({
                              id: `pages.data.option.${
                                record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
                              }`,
                              defaultMessage: record?.state?.value !== 'disabled' ? '禁用' : '启用',
                            })}
                          </PermissionButton>,
                          <PermissionButton
                            key="delete"
                            isPermission={permission.delete}
                            type={'link'}
                            style={{ padding: 0 }}
                            tooltip={
                              record?.state?.value !== 'disabled'
                                ? {
                                    title: '已启用的采集器不能删除',
                                  }
                                : undefined
                            }
                            disabled={record?.state?.value !== 'disabled'}
                            popConfirm={{
                              title: '该操作将会删除下属点位，确定删除？',
                              disabled: record?.state?.value !== 'disabled',
                              onConfirm: async () => {
                                if (record?.state?.value === 'disabled') {
                                  await service.removeCollector(record.id);
                                  onlyMessage(
                                    intl.formatMessage({
                                      id: 'pages.data.option.success',
                                      defaultMessage: '操作成功!',
                                    }),
                                  );
                                  handleSearch(param);
                                } else {
                                  onlyMessage(
                                    intl.formatMessage({ id: 'pages.device.instance.deleteTip' }),
                                    'error',
                                  );
                                }
                              },
                            }}
                          >
                            <DeleteOutlined />
                          </PermissionButton>,
                        ]}
                      />
                    </Col>
                  ))}
                </Row>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                  }}
                >
                  <Pagination
                    showSizeChanger
                    size="small"
                    className={'pro-table-card-pagination'}
                    total={dataSource?.total || 0}
                    current={dataSource?.pageIndex + 1}
                    onChange={(page, size) => {
                      handleSearch({
                        ...param,
                        pageIndex: page - 1,
                        pageSize: size,
                      });
                    }}
                    pageSizeOptions={[12, 24, 48, 96]}
                    pageSize={dataSource?.pageSize}
                    showTotal={(num) => {
                      const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                      const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                      return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={{ height: minHeight - 150 }}>
                <Empty />
              </div>
            )}
          </div>
        </div>
      </Card>
      {CollectorModel.visible && (
        <Save
          data={CollectorModel.current}
          channelId={props.id}
          provider={props.provider}
          close={() => {
            CollectorModel.visible = false;
          }}
          reload={() => {
            CollectorModel.visible = false;
            handleSearch(param);
            if (props?.reload) {
              props.reload();
            }
          }}
        />
      )}
    </div>
  );
});
