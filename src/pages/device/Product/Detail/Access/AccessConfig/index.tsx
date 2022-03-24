import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, message, Modal, Pagination, Row } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { productModel } from '@/pages/device/Product';
import SearchComponent from '@/components/SearchComponent';
import type { ProColumns } from '@jetlinks/pro-table';
import styles from '../index.less';
import Service from '@/pages/device/Product/service';

interface Props {
  close: () => void;
  data?: any;
}

const AccessConfig = (props: Props) => {
  const { close } = props;
  const service1 = new Service('device-product');

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 4,
    pageIndex: 0,
    total: 0,
  });
  const [param, setParam] = useState<any>({ pageSize: 4 });

  const [currrent, setCurrrent] = useState<any>({
    id: productModel.current?.accessId,
    name: productModel.current?.accessName,
    protocol: productModel.current?.messageProtocol,
    transport: productModel.current?.transportProtocol,
    protocolDetail: {
      name: productModel.current?.protocolName,
    },
  });

  const handleSearch = (params: any) => {
    setParam(params);
    service
      .queryList({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
      .then((resp) => {
        setDataSource(resp.result);
      });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
  ];

  useEffect(() => {
    handleSearch(param);
  }, []);

  return (
    <Modal
      onCancel={() => {
        close();
      }}
      visible
      width={1200}
      title={'设备接入配置'}
      onOk={() => {
        if (!!currrent) {
          service1
            .update({
              ...productModel.current,
              transportProtocol: currrent.transport,
              protocolName: currrent.protocolDetail.name,
              accessId: currrent.id,
              accessName: currrent.name,
              messageProtocol: currrent.protocol,
            })
            .then((resp) => {
              if (resp.status === 200) {
                service1.detail(productModel.current?.id || '').then((res) => {
                  if (res.status === 200) {
                    productModel.current = { ...res.result };
                    message.success('操作成功！');
                    close();
                  }
                });
              }
            });
        } else {
          message.success('请选择接入方式');
        }
      }}
    >
      <SearchComponent
        field={columns}
        pattern={'simple'}
        onSearch={(data: any) => {
          const dt = {
            pageSize: 4,
            terms: [...data.terms],
          };
          handleSearch(dt);
        }}
        onReset={() => {
          handleSearch({ pageSize: 4 });
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          onClick={() => {
            const tab: any = window.open(`${origin}/#/link/AccessConfig/Detail`);
            tab!.onTabSaveSuccess = (value: any) => {
              if (value.status === 200) {
                handleSearch(param);
              }
            };
          }}
        >
          新增
        </Button>
      </div>
      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
        {dataSource.data.map((item: any) => (
          <Col key={item.name} span={12}>
            <Card
              style={{
                width: '100%',
                border: currrent?.id === item.id ? '1px solid #1d39c4' : '',
              }}
              hoverable
              onClick={() => {
                setCurrrent(item);
              }}
            >
              <div className={styles.box}>
                <div className={styles.images}>{item.name}</div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <div className={styles.top}>
                      <div className={styles.title}>{item.name}</div>
                      <div className={styles.status}>
                        <Badge
                          color={item.state.value === 'disabled' ? 'red' : 'green'}
                          text={item.state.text}
                          style={{ marginLeft: '20px' }}
                        />
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
          pageSizeOptions={[4, 8, 16, 32]}
          pageSize={dataSource?.pageSize}
          showTotal={(num) => {
            const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
            const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
            return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
          }}
        />
      </div>
    </Modal>
  );
};
export default AccessConfig;
