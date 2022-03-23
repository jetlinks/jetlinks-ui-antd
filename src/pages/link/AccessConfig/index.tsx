import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, Card, Col, message, Pagination, Popconfirm, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import styles from './index.less';
import Service from './service';

export const service = new Service('gateway/device');

const AccessConfig = () => {
  const history = useHistory();
  const [param, setParam] = useState<any>({ pageSize: 10 });

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
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
        setDataSource(resp.result);
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
          pattern={'simple'}
          onSearch={(data: any) => {
            const dt = {
              pageSize: 10,
              terms: [...data.terms],
            };
            handleSearch(dt);
          }}
          onReset={() => {
            handleSearch({ pageSize: 10 });
          }}
        />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            onClick={() => {
              history.push(`${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}`);
            }}
          >
            新增
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
          {dataSource.data.map((item: any) => (
            <Col key={item.name} span={12}>
              <Card hoverable>
                <div className={styles.box}>
                  <div className={styles.images}>{item.name}</div>
                  <div className={styles.content}>
                    <div className={styles.header}>
                      <div className={styles.top}>
                        <div className={styles.left}>
                          <div className={styles.title}>{item.name}</div>
                          <div className={styles.status}>
                            <Badge
                              color={item.state.value === 'disabled' ? 'red' : 'green'}
                              text={item.state.text}
                              style={{ marginLeft: '20px' }}
                            />
                          </div>
                        </div>
                        <div className={styles.action}>
                          <a
                            key="edit"
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
                          </a>
                          <a key="warning">
                            <Popconfirm
                              title={`确认${item.state.value !== 'disabled' ? '禁用' : '启用'}`}
                              onConfirm={() => {
                                if (item.state.value !== 'disabled') {
                                  service.shutDown(item.id).then((resp) => {
                                    if (resp.status === 200) {
                                      message.success('操作成功！');
                                    }
                                  });
                                } else {
                                  service.startUp(item.id).then((resp) => {
                                    if (resp.status === 200) {
                                      message.success('操作成功！');
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
                          </a>
                          <a key="remove">
                            <Popconfirm
                              title={'确认删除?'}
                              onConfirm={() => {
                                service.remove(item.id).then((resp: any) => {
                                  if (resp.status === 200) {
                                    message.success('操作成功！');
                                  }
                                });
                              }}
                            >
                              <DeleteOutlined />
                              删除
                            </Popconfirm>
                          </a>
                        </div>
                      </div>
                      <div className={styles.desc}>这里是接入方式的解释说明</div>
                    </div>
                    <div className={styles.container}>
                      <div className={styles.server}>
                        <div className={styles.title}>{item?.channelInfo?.name}</div>
                        <p>
                          {item.channelInfo?.addresses.map((i: any) => (
                            <div key={i.address}>
                              <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                            </div>
                          ))}
                        </p>
                      </div>
                      <div className={styles.procotol}>
                        <div className={styles.title}>{item?.protocolDetail?.name}</div>
                        <p style={{ color: 'rgba(0, 0, 0, .55)' }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
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
      </Card>
    </PageContainer>
  );
};

export default AccessConfig;
