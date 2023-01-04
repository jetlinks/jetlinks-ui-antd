import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { Card, Col, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/media/Stream/service';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { model } from '@formily/reactive';
import { PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';
import StreamCard from '@/components/ProTableCard/CardItems/Stream';
import { onlyMessage } from '@/utils/util';
import { Empty } from '@/components';

export const service = new Service('media/server');

export const StreamModel = model<{
  current: Partial<StreamItem>;
}>({
  current: {},
});

const Stream = () => {
  const history = useHistory();
  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });
  const permissionCode = 'media/Stream';
  const { permission } = PermissionButton.usePermission(permissionCode);
  const { minHeight } = useDomFullHeight(`.stream`, 24);

  const columns: ProColumns<StreamItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
    },
  ];

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const handleSearch = (params?: any) => {
    service
      .query({
        ...params,
        sorts: [
          {
            name: 'id',
            order: 'desc',
          },
        ],
      })
      .then((resp) => {
        if (resp.status === 200) {
          setDataSource(resp.result);
        }
      });
  };

  useEffect(() => {
    handleSearch(param);
  }, [param]);

  return (
    <PageContainer>
      <SearchComponent<StreamItem>
        field={columns}
        target="stream"
        onSearch={(data) => {
          setParam({
            ...param,
            terms: data?.terms ? [...data?.terms] : [],
          });
        }}
      />
      <Card>
        <div className="stream" style={{ position: 'relative', minHeight }}>
          <div style={{ height: '100%', paddingBottom: 48 }}>
            <div>
              <PermissionButton
                isPermission={permission.add}
                onClick={() => {
                  history.push(`${getMenuPathByParams(MENUS_CODE['media/Stream/Detail'])}`);
                  StreamModel.current = {};
                }}
                key="button"
                icon={<PlusOutlined />}
                type="primary"
              >
                新增
              </PermissionButton>
            </div>
            {dataSource.data.length > 0 ? (
              <div>
                <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
                  {(dataSource?.data || []).map((item: any) => (
                    <Col key={item.id} span={12}>
                      <StreamCard
                        {...item}
                        detail={
                          <PermissionButton
                            type="link"
                            isPermission={permission.view}
                            style={{ padding: 0, fontSize: 24, color: '#fff' }}
                            key="view"
                            onClick={() => {
                              history.push(
                                `${getMenuPathByParams(
                                  MENUS_CODE['media/Stream/Detail'],
                                  item.id,
                                )}`,
                                { view: true },
                              );
                              StreamModel.current = { ...item };
                            }}
                          >
                            <EyeOutlined />
                          </PermissionButton>
                        }
                        actions={[
                          <PermissionButton
                            isPermission={permission.update}
                            onClick={() => {
                              history.push(
                                `${getMenuPathByParams(
                                  MENUS_CODE['media/Stream/Detail'],
                                  item.id,
                                )}`,
                              );
                              StreamModel.current = { ...item };
                            }}
                            key="button"
                            type="link"
                          >
                            <EditOutlined />
                            编辑
                          </PermissionButton>,
                          <PermissionButton
                            isPermission={permission.action}
                            key="action"
                            type={'link'}
                            popConfirm={{
                              title: `确认${item?.state?.value === 'enabled' ? '禁用' : '启用'}?`,
                              onConfirm: async () => {
                                if (item?.state?.value === 'enabled') {
                                  const res = await service.disable(item.id);
                                  if (res.status === 200) {
                                    onlyMessage('操作成功');
                                    handleSearch(param);
                                  }
                                } else {
                                  const res = await service.enalbe(item.id);
                                  if (res.status === 200) {
                                    onlyMessage('操作成功');
                                    handleSearch(param);
                                  }
                                }
                              },
                            }}
                          >
                            {item?.state?.value === 'enabled' ? (
                              <CloseCircleOutlined />
                            ) : (
                              <PlayCircleOutlined />
                            )}
                            {item?.state?.value === 'enabled' ? '禁用' : '启用'}
                          </PermissionButton>,
                          <PermissionButton
                            isPermission={permission.delete}
                            tooltip={
                              item?.state?.value === 'enabled'
                                ? {
                                    title: '正常的流媒体服务不能删除',
                                  }
                                : undefined
                            }
                            disabled={item?.state?.value === 'enabled'}
                            popConfirm={{
                              title: '确认删除',
                              onConfirm: () => {
                                service.remove(item.id).then((resp: any) => {
                                  if (resp.status === 200) {
                                    onlyMessage('操作成功！');
                                    handleSearch({ pageSize: 10, terms: [] });
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
              </div>
            ) : (
              <Empty style={{ marginTop: '10%' }} />
            )}
          </div>
          {dataSource.data.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                bottom: 0,
                width: '100%',
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
        </div>
      </Card>
    </PageContainer>
  );
};
export default Stream;
