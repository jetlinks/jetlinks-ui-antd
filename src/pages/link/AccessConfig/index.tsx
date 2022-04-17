import SearchComponent from '@/components/SearchComponent';
import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@jetlinks/pro-table';
import { Button, Card, Col, Empty, message, Pagination, Popconfirm, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import Service from './service';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import AccessConfigCard from '@/components/ProTableCard/CardItems/AccessConfig';

export const service = new Service('gateway/device');

const AccessConfig = () => {
  const history = useHistory();
  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });

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
      .queryList({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
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
          <Button
            type="primary"
            disabled={getButtonPermission('link/AccessConfig', ['add'])}
            onClick={() => {
              history.push(`${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}`);
            }}
          >
            新增
          </Button>
        </div>
        {dataSource?.data.length > 0 ? (
          <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
            {(dataSource?.data || []).map((item: any) => (
              <Col key={item.id} span={12}>
                <AccessConfigCard
                  {...item}
                  actions={[
                    <Button
                      key="edit"
                      type="link"
                      onClick={() => {
                        history.push(
                          `${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}?id=${
                            item.id
                          }`,
                        );
                      }}
                    >
                      <EditOutlined />
                      编辑
                    </Button>,
                    <Button
                      key="warning"
                      type="link"
                      disabled={getButtonPermission('link/AccessConfig', ['action'])}
                    >
                      <Popconfirm
                        title={`确认${item.state.value !== 'disabled' ? '禁用' : '启用'}`}
                        onConfirm={() => {
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
                        }}
                      >
                        {item.state.value !== 'disabled' ? (
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
                      </Popconfirm>
                    </Button>,
                    <Tooltip
                      key="delete"
                      title={
                        getButtonPermission('link/AccessConfig', ['delete']) ? '没有权限' : '删除'
                      }
                    >
                      <Button
                        type="link"
                        disabled={getButtonPermission('link/AccessConfig', ['delete'])}
                      >
                        <Popconfirm
                          title={'确认删除?'}
                          onConfirm={() => {
                            service.remove(item.id).then((resp: any) => {
                              if (resp.status === 200) {
                                message.success('操作成功！');
                                handleSearch(param);
                              } else {
                                message.error(resp?.message || '操作失败');
                              }
                            });
                          }}
                        >
                          <DeleteOutlined />
                          删除
                        </Popconfirm>
                      </Button>
                    </Tooltip>,
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
