import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@jetlinks/pro-table';
import { Card, Col, Empty, message, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import Service from './service';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import AccessConfigCard from '@/components/ProTableCard/CardItems/AccessConfig';
import { PermissionButton } from '@/components';

export const service = new Service('gateway/device');

const AccessConfig = () => {
  const history = useHistory();
  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });
  const { permission } = PermissionButton.usePermission('link/AccessConfig');

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '已停止',
          status: 'disabled',
        },
        enabled: {
          text: '已启动',
          status: 'enabled',
        },
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
  ];

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const handleSearch = (params: any) => {
    setParam(params);
    service
      .queryGatewayDetail({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, []);

  return (
    <PageContainer>
      <Card>
        <SearchComponent
          field={columns}
          // enableSave={false}
          target={'access-config'}
          onSearch={(data: any) => {
            const dt = {
              pageSize: 10,
              terms: [...data?.terms],
            };
            handleSearch(dt);
          }}
        />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <PermissionButton
            isPermission={permission.add}
            onClick={() => {
              history.push(`${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}`);
            }}
            key="button"
            type="primary"
          >
            新增
          </PermissionButton>
        </div>
        {dataSource?.data.length > 0 ? (
          <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
            {(dataSource?.data || []).map((item: any) => (
              <Col key={item.id} span={12}>
                <AccessConfigCard
                  {...item}
                  actions={[
                    <PermissionButton
                      isPermission={permission.update}
                      onClick={() => {
                        history.push(
                          `${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}?id=${
                            item.id
                          }`,
                        );
                      }}
                      key="button"
                      type="link"
                    >
                      <EditOutlined />
                      编辑
                    </PermissionButton>,
                    <PermissionButton
                      type={'link'}
                      key={'state'}
                      style={{ padding: 0 }}
                      popConfirm={{
                        title: `确认${item.state.value !== 'disabled' ? '禁用' : '启用'}`,
                        onConfirm: () => {
                          if (item.state.value !== 'disabled') {
                            service.shutDown(item.id).then((resp) => {
                              if (resp.status === 200) {
                                message.success('操作成功！');
                                handleSearch(param);
                              }
                            });
                          } else {
                            service.startUp(item.id).then((resp) => {
                              if (resp.status === 200) {
                                message.success('操作成功！');
                                handleSearch(param);
                              }
                            });
                          }
                        },
                      }}
                      isPermission={permission.action}
                      tooltip={{
                        title: item.state.value !== 'disabled' ? '禁用' : '启用',
                      }}
                    >
                      {item.state.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
                      {item.state.value !== 'disabled' ? '禁用' : '启用'}
                    </PermissionButton>,
                    <PermissionButton
                      isPermission={permission.delete}
                      disabled={item.state.value !== 'disabled'}
                      tooltip={{
                        title: item.state.value !== 'disabled' ? '请先禁用，再删除' : '',
                      }}
                      popConfirm={{
                        title: '确认删除',
                        disabled: item.state.value !== 'disabled',
                        onConfirm: () => {
                          service.remove(item.id).then((resp: any) => {
                            if (resp.status === 200) {
                              message.success('操作成功！');
                              handleSearch(param);
                            } else {
                              message.error(resp?.message || '操作失败');
                            }
                          });
                        },
                      }}
                      key="delete"
                      type="link"
                    >
                      <DeleteOutlined />
                    </PermissionButton>,
                  ]}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty />
        )}
        {dataSource.data.length > 0 && (
          <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
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
              pageSizeOptions={[10, 20, 50, 100]}
              pageSize={dataSource?.pageSize}
              showTotal={(num) => {
                const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
              }}
            />
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default AccessConfig;
