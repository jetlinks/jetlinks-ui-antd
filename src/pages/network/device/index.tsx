import AutoHide from '@/pages/analysis/components/Hide/autoHide';
import { Avatar, Badge, Card, Icon, List, Modal, Switch, Table, Tooltip } from 'antd';
import Button from 'antd/es/button';
import React from 'react';
import Img from '../img/产品.png';
import { useState } from 'react';
import styles from '../material/index.less';
import Input from 'antd/es/input';
import SearchForm from '@/components/SearchForm';
import Edit from './edit';

function Device() {

  const [active, setActive] = useState<boolean>(true);
  const [delVisible, setDelVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>({});
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>({});

  const iconStyles = {
    color: '#1890FF',
    border: '1px solid #1890FF'
  }
  const renderTitle = (item: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '95%', fontWeight: 600, fontSize: '16px' }}><AutoHide title={item.name} /></div>
        <div><Switch defaultChecked={item.state?.value === 'enabled'} onChange={(checked: boolean) => {
          console.log(checked)
        }} /></div>
      </div>
    )
  }
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '网关类型',
      dataIndex: 'gatewayProvider',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '120px',
      // render: record =>
      //   record ? <Badge status={statusMap.get(record.text)} text={record.text} /> : '',
    },
    {
      title: '接入设备树',
      dataIndex: 'registryTime',
      width: '200px',
    },
    {
      title: '操作',
      dataIndex: 'registryTime',
      width: '200px',
    }
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>设备管理</div>
        <div className={styles.right}>
          <Input.Search style={{ marginRight: '16px' }} />
          <Button style={{ marginRight: '16px' }}>批量导入设备</Button>
          <Button type="primary" style={{ marginRight: '16px' }} onClick={() => {
            setEditVisible(true);
            setCurrentData({});
          }}>新增设备</Button>
          <div className={styles.iconBox}>
            <div className={styles.icon} style={active ? iconStyles : { borderRight: 'none' }} onClick={() => {
              setActive(true);
            }}><Icon type="unordered-list" /></div>
            <div className={styles.icon} style={!active ? iconStyles : { borderLeft: 'none' }} onClick={() => {
              setActive(false);
            }}><Icon type="appstore" /></div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>总设备数： 20</span>
            <span></span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'green'} text="在线数" />1</span>
            <span style={{ marginLeft: '20px', color: 'rgba(0, 0, 0, 0.45)' }}><Badge color={'red'} text="离线数" />1</span>
          </div>
          <div><a onClick={() => {
            setSearchVisible(!searchVisible)
          }}>高级筛选<Icon type="up" /></a></div>
        </div>
        {
          searchVisible && (
            <div>
              <SearchForm
                formItems={[
                  {
                    label: '设备ID',
                    key: 'deviceId$LIKE',
                    type: 'string',
                  },
                  {
                    label: '产品名称',
                    key: 'name$IN',
                    type: 'list',
                    props: {
                      data: [
                        { id: 'stopped', name: '已停止' },
                        { id: 'started', name: '运行中' },
                        { id: 'disable', name: '已禁用' },
                      ]
                    }
                  },
                  {
                    label: '设备状态',
                    key: 'state$IN',
                    type: 'list',
                    props: {
                      data: [
                        { id: 'stopped', name: '已停止' },
                        { id: 'started', name: '运行中' },
                        { id: 'disable', name: '已禁用' },
                      ]
                    }
                  },
                ]}
                search={(params: any) => {

                }}
              />
            </div>
          )
        }
      </div>
      <div>
        {active ? <div>
          <List<any>
            rowKey="id"
            grid={{ gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }}
            dataSource={dataList.data || []}
            pagination={{
              // current: dataList.pageIndex + 1,
              // total: dataList.total,
              // pageSize: dataList.pageSize,
              // // onChange,
              // showQuickJumper: true,
              // showSizeChanger: true,
              // hideOnSinglePage: true,
              // pageSizeOptions: ['8', '16', '40', '80'],
              // style: { marginTop: -20 },
              // showTotal: (total: number) =>
              //     `共 ${total} 条记录 第  ${dataList.pageIndex + 1}/${Math.ceil(
              //         dataList.total / dataList.pageSize,
              //     )}页`
            }}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                      actions={[
                        <Tooltip placement="bottom" title="编辑">
                          <a onClick={() => {
                            setCurrentData(item);
                            setEditVisible(true);
                          }}>编辑</a>
                        </Tooltip>,
                        <Tooltip placement="bottom" title="查看">
                          <a onClick={() => {

                          }}>查看</a>
                        </Tooltip>,
                        <Tooltip placement="bottom" title="删除">
                          <a onClick={() => {
                            setDelVisible(true);
                          }}>删除</a>
                        </Tooltip>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar size={60} src={Img} />}
                        title={renderTitle(item)}
                        description={`ID：${item.id}`}
                      />
                      <div className={styles.content}>
                        <div className={styles.item}>
                          <p className={styles.itemTitle}>状态</p>
                          <p className={styles.itemText}><Badge color={'red'} text="离线" /></p>
                        </div>
                        <div className={styles.item}>
                          <p className={styles.itemTitle}>产品名称</p>
                          <p className={styles.itemText}>树莓派产品</p>
                        </div>
                      </div>
                      <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}>注册时间：2021-05-06 17:20:05</div>
                    </Card>
                  </List.Item>
                );
              }
              return;
            }}
          />
        </div> : <div>
          <Table
            columns={columns}
            dataSource={dataList.data}
            rowKey="id"
          // onChange={onTableChange}
          // pagination={{
          //   current: deviceData.pageIndex + 1,
          //   total: deviceData.total,
          //   pageSize: deviceData.pageSize,
          //   showQuickJumper: true,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['10', '20', '50', '100'],
          //   showTotal: (total: number) =>
          //     `共 ${total} 条记录 第  ${deviceData.pageIndex + 1}/${Math.ceil(
          //       deviceData.total / deviceData.pageSize,
          //     )}页`,
          // }}
          />
        </div>}
      </div>
      <Edit
        data={currentData}
        visible={editVisible}
        onOk={() => {

        }}
        onCancel={() => {
          setEditVisible(false)
        }}
      />
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

export default Device;