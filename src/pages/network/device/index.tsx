import { Avatar, Badge, Card, Form, Icon, message, Modal, Popconfirm, Row, Select, Spin } from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import Img from '../img/产品.png';
import { useState } from 'react';
import styles from './index.less';
import Input from 'antd/es/input';
import Save from './save';
import Detail from './detail';
import Cards from '@/components/Cards';
import Service from './service';
import { useEffect } from 'react';
import encodeQueryParam from '@/utils/encodeParam';
import moment from 'moment';
import { FormComponentProps } from 'antd/lib/form';
import Col from 'antd/es/grid/col';
import ImportModel from "@/pages/device/instance/operation/import";

interface Props extends FormComponentProps {

}

function Device(props: Props) {

  const service = new Service('/network/material');

  const { form: { getFieldDecorator }, form } = props;
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [deviceOfflineCount, setDeviceOfflineCount] = useState<number>(0);
  const [deviceOnlineCount, setDeviceOnlineCount] = useState<number>(0);
  const [delVisible, setDelVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>({});
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 10
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [dataList, setDataList] = useState<any>({
    data: [],
    pageIndex: 0,
    pageSize: 8,
    total: 0
  });

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');
  statusMap.set('未激活', 'processing');
  statusMap.set('online', 'success');
  statusMap.set('offline', 'error');
  statusMap.set('notActive', 'processing');

  const handleSearch = (params: any) => {
    setSearchParam(params);
    setLoading(true);
    service.getDeviceList(encodeQueryParam(params)).subscribe(
      (res) => {
        setDataList(res)
      },
      () => {
      },
      () => setLoading(false))
  };

  const getProductList = () => {
    service.getDeviceGatewayList({ paging: false }).subscribe(
      (res) => {
        setProductList(res);
      }
    )
  }

  const deploy = (id: string) => {
    service.deployDevice(id).subscribe(
      () => {
        handleSearch(searchParam);
        message.success('操作成功！');
      },
      () => {
      },
      () => setLoading(false))
  };

  const undeploy = (id: string) => {
    service.undeployDevice(id).subscribe(
      () => {
        handleSearch(searchParam);
        message.success('操作成功！');
      },
      () => {
      },
      () => setLoading(false))
  };

  useEffect(() => {
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceCount(resp.result[0])
      }
    })
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "state", "value": "online" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceOnlineCount(resp.result[0])
      }
    })
    service.getDeviceCount({
      "terms":
        [
          { "column": "productId", "value": "onvif-media-device", "termType": "not" },
          { "column": "state", "value": "offline" }
        ]
    }).subscribe(resp => {
      if (resp.status === 200) {
        setDeviceOfflineCount(resp.result[0])
      }
    })
    handleSearch({ pageSize: 8 });
    getProductList();
  }, []);

  const saveData = (params?: any) => {
    if (currentData.id) {
      service.saveDevice(params).subscribe(
        (res) => {
          if (res.status === 200) {
            message.success('操作成功！');
            handleSearch({ pageSize: 8 });
          }
        });
    } else {
      service.insertDevice(params).subscribe(
        (res) => {
          if (res.status === 200) {
            message.success('操作成功！');
            handleSearch({ pageSize: 8 });
          }
        }
      );
    }
  };

  const BatchImport = (productId: string, fileUrl: string) => {
    service.batchImport({ productId, fileUrl }).subscribe(
      (res) => {
        if (res.status === 200) {
          message.success('操作成功！')
          handleSearch({ pageSize: 8 });
        }
      }
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <Spin spinning={loading}>
        {!detailVisible ?
          <Cards
            title='设备管理'
            cardItemRender={(item: any) => <div style={{ height: 200, backgroundColor: '#fff' }}>
              <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <a onClick={() => {
                    setCurrentData(item);
                    setEditVisible(true);
                  }}>编辑</a>,
                  <a onClick={() => {
                    setCurrentData(item);
                    setDetailVisible(true);
                  }}>查看</a>,
                  <Popconfirm
                    title={`确认${item.state?.value === 'notActive' ? '启动' : '禁用'}吗？`}
                    onConfirm={() => {
                      if (item.state?.value === 'notActive') {
                        deploy(item.id);
                      } else {
                        undeploy(item.id);
                      }
                    }}>
                    <a>{item.state?.value === 'notActive' ? '启动' : '禁用'}</a>
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size={60} src={Img} />}
                  title={item.name}
                  description={`ID：${item.id}`}
                />
                <div className={styles.content}>
                  <div className={styles.item}>
                    <p className={styles.itemTitle}>状态</p>
                    <p className={styles.itemText}><Badge status={statusMap.get(item?.state?.value)} text={item?.state?.text} /></p>
                  </div>
                  <div className={styles.item}>
                    <p className={styles.itemTitle}>产品名称</p>
                    <p className={styles.itemText}>{item.productName}</p>
                  </div>
                </div>
                <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}>注册时间：2021-05-06 17:20:05</div>
              </Card>
            </div>}
            toolNode={
              <div style={{ display: 'flex' }}>
                <Input.Search style={{ marginRight: '16px' }} allowClear placeholder="请输入设备名称" onSearch={(value: string) => {
                  setSearchValue(value);
                  let list = searchParam.where ? searchParam.where.split(' and ') : [];
                  let where: string[] = list.filter((item: string) => {
                    return item.includes('=');
                  });
                  where.push(`name like '%${value}%'`);
                  handleSearch({
                    where: where.join(' and '),
                    pageSize: 8
                  });
                }} />
                <Button style={{ marginRight: '16px' }} onClick={() => { setImportVisible(true) }}>批量导入设备</Button>
                <Button type="primary" style={{ marginRight: '16px' }} onClick={() => {
                  setEditVisible(true);
                  setCurrentData({});
                }}>新增设备</Button>
              </div>
            }
            pagination={{
              current: dataList?.pageIndex + 1,
              total: dataList?.total,
              pageSize: dataList?.pageSize,
              onChange: (page: number, pageSize?: number) => {
                handleSearch({
                  ...searchParam,
                  pageIndex: page - 1,
                  pageSize: pageSize || searchParam.pageSize
                })
              },
              onShowSizeChange: (current, size) => {
                handleSearch({
                  ...searchParam,
                  pageIndex: current,
                  pageSize: size || searchParam.pageSize
                })
              },
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['8', '16', '40', '80'],
              showTotal: (total: number) =>
                `共 ${total} 条记录 第  ${dataList?.pageIndex + 1}/${Math.ceil(
                  dataList?.total / dataList?.pageSize,
                )}页`
            }}
            extraTool={
              <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>总设备数： {deviceCount}</span>
                    <span></span>
                    <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'green'} text="在线数" />{deviceOnlineCount}</span>
                    <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'red'} text="离线数" />{deviceOfflineCount}</span>
                  </div>
                  <div onClick={() => { setSearchVisible(!searchVisible) }} style={{ color: '#1890FF', cursor: 'pointer' }}>
                    高级筛选 <Icon style={{ transform: `rotate( ${searchVisible ? 0 : '-180deg'})`, transition: 'all .3s' }} type="down" />
                  </div>
                </div>
                <div style={!searchVisible ? { height: 0, overflow: 'hidden', transition: 'all .3s' } : { height: '100px', marginTop: '20px' }}>
                  <Form
                    labelCol={{
                      xs: { span: 6 },
                      sm: { span: 3 },
                    }}
                    wrapperCol={{
                      xs: { span: 36 },
                      sm: { span: 18 },
                    }}>
                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item label="设备ID">
                          {getFieldDecorator('id', {})(
                            <Input />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="产品名称">
                          {getFieldDecorator('productName', {})(
                            <Select allowClear>
                              {
                                productList.map((item, index) => (
                                  <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                                ))
                              }
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="设备状态">
                          {getFieldDecorator('state', {})(
                            <Select allowClear>
                              {/* <Select.Option value="">全部</Select.Option> */}
                              <Select.Option value="online">在线</Select.Option>
                              <Select.Option value="offline">离线</Select.Option>
                              <Select.Option value="notActive">未启用</Select.Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <div style={{ paddingLeft: '76px' }}>
                    <Button style={{ marginRight: '10px' }} onClick={() => {
                      form.resetFields();
                      handleSearch({
                        where: `name like '%${searchValue}%'`,
                        pageSize: 8
                      })
                    }}>重置</Button>
                    <Button type="primary" onClick={() => {
                      const data = form.getFieldsValue();
                      let list = searchParam.where ? searchParam.where.split(' and ') : [];
                      let where: string[] = list.filter((item: string) => {
                        return item.includes('like');
                      });
                      Object.keys(data).forEach(i => {
                        if (data[i]) {
                          where.push(`${i}=${data[i]}`)
                        }
                      })
                      handleSearch({
                        where: where.join(' and '),
                        pageSize: 8
                      });
                    }}>查询</Button>
                  </div>
                </div>
              </div>
            }
            dataSource={dataList.data}
            columns={[
              {
                title: '设备ID',
                dataIndex: 'id',
                ellipsis: true,
                align: 'center'
              },
              {
                title: '设备名称',
                dataIndex: 'name',
                ellipsis: true,
                align: 'center'
              },
              {
                title: '产品名称',
                dataIndex: 'productName',
                ellipsis: true,
                align: 'center'
              },
              {
                title: '注册时间',
                dataIndex: 'registryTime',
                render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
                width: '200px',
                align: 'center'
              },
              {
                title: '状态',
                dataIndex: 'state',
                width: '120px',
                align: 'center',
                render: record =>
                  record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
              },
              {
                title: '说明',
                align: 'center',
                dataIndex: 'describe',
                width: '200px',
              },
              {
                title: '操作',
                align: 'center',
                render: (record) => <>
                  <Button type='link' onClick={() => {
                    setCurrentData(record);
                    setDetailVisible(true);
                  }}>查看</Button>
                  <Button type='link' onClick={() => {
                    setCurrentData(record);
                    setEditVisible(true);
                  }}>编辑</Button>
                  {
                    record?.state?.value === 'notActive' ?
                      <Popconfirm
                        title="确认启动吗？"
                        onConfirm={() => {
                          deploy(record.id)
                        }}>
                        <Button type='link'>启动</Button>
                      </Popconfirm>
                      :
                      <Popconfirm
                        title="确认禁用吗？"
                        onConfirm={() => {
                          undeploy(record.id)
                        }}>
                        <Button type='link'>禁用</Button>
                      </Popconfirm>
                  }
                </>,
                width: 280
              },
            ]}
          />
          : <Detail data={currentData} reBack={() => {
            setDetailVisible(false);
          }} />
        }
      </Spin>
      {editVisible && <Save
        data={currentData}
        close={() => {
          setEditVisible(false);
          setCurrentData({});
        }}
        save={(item: any) => {
          saveData(item);
          setEditVisible(false);
          setCurrentData({});
        }} />
      }
      {
        importVisible &&
        <ImportModel
          productId=''
          close={() => {
            setImportVisible(false)
          }}
        />
      }
      <Modal
        title="确认删除"
        visible={delVisible}
        onOk={() => { }}
        onCancel={() => { setDelVisible(false) }}
      >
        <p>删除该产品，该产品下的所有信息及设备都将被删除，</p>
        <p>是否确认删除？</p>
      </Modal>
    </div>
  );
}

// export default Device;
export default Form.create<Props>()(Device);