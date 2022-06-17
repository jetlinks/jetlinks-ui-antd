import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import { Button, Card, Col, Empty, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import Service from '@/pages/media/Stream/service';
import { getButtonPermission, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { model } from '@formily/reactive';
import { PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';
import StreamCard from '@/components/ProTableCard/CardItems/Stream';
import { onlyMessage } from '@/utils/util';

export const service = new Service('media/server');

export const StreamModel = model<{
  current: Partial<StreamItem>;
}>({
  current: {},
});

const Stream = () => {
  const history = useHistory<Record<string, string>>();
  const [param, setParam] = useState<any>({ pageSize: 10, terms: [] });
  const permissionCode = 'media/Stream';
  const { permission } = PermissionButton.usePermission(permissionCode);
  const { minHeight } = useDomFullHeight(`.stream`);

  const columns: ProColumns<StreamItem>[] = [
    {
      dataIndex: 'name',
      title: '名称',
      ellipsis: true,
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
      <Card className="stream" style={{ minHeight }}>
        {dataSource.data.length > 0 ? (
          <>
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
            <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
              {(dataSource?.data || []).map((item: any) => (
                <Col key={item.id} span={12}>
                  <StreamCard
                    {...item}
                    actions={[
                      <PermissionButton
                        isPermission={permission.update}
                        onClick={() => {
                          history.push(
                            `${getMenuPathByParams(MENUS_CODE['media/Stream/Detail'], item.id)}`,
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
                        isPermission={permission.delete}
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
          </>
        ) : (
          <Empty
            style={{ marginTop: '10%' }}
            description={
              <span>
                暂无数据，请先
                <Button
                  type="link"
                  disabled={getButtonPermission('media/Stream', ['add'])}
                  onClick={() => {
                    history.push(`${getMenuPathByParams(MENUS_CODE['media/Stream/Detail'])}`);
                    StreamModel.current = {};
                  }}
                >
                  新增流媒体服务
                </Button>
              </span>
            }
          />
        )}
      </Card>
    </PageContainer>
  );
};
export default Stream;
