import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Dropdown, Icon, Menu, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import Service from './service';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import Cat from './cat';
import ProTable from '@/pages/system/permission/component/ProTable';
import encodeQueryParam from '@/utils/encodeParam';
import Send from './send';

const Command = () => {
  const service = new Service('device/message/task');
  const [result, setResult] = useState<any>({});
  const [searchParam, setSearchParam] = useState<any>({ pageIndex: 0, pageSize: 10 });
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});
  const [send, setSend] = useState<boolean>(false);
  const [deviceIds, setDeviceids] = useState<string[]>([]);
  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handleSearch = (param: any) => {
    setSearchParam(param);
    service.query(encodeQueryParam(param)).subscribe(data => {
      setResult(data);
    });
  };

  const columns = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '指令类型',
      dataIndex: 'messageType',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (value: any) => value.text,
    },
    {
      title: '错误信息',
      dataIndex: 'lastError',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setVisible(true);
              setCurrent(record);
            }}
          >
            查看指令
          </a>
          {record.state.value !== 'wait' && (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  service.resend(encodeQueryParam({ terms: { id: record.id } })).subscribe(
                    data => {
                      message.success('操作成功');
                    },
                    () => {},
                    () => handleSearch(searchParam),
                  );
                }}
              >
                重新发送
              </a>
            </>
          )}
        </Fragment>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          icon="arrow-down"
          type="danger"
          onClick={() => {
            service
              .sendBatchCommand(encodeQueryParam({ terms: { id: deviceIds } }))
              .subscribe(data => {
                message.success('操作成功');
              });
          }}
        >
          重新发送选中指令
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          icon="arrow-down"
          type="danger"
          onClick={() => {
            service.sendBatchCommand(encodeQueryParam(searchParam)).subscribe(data => {
              message.success('操作成功');
            });
          }}
        >
          重新发送全部指令
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <PageHeaderWrapper title="指令下发">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
              formItems={[
                {
                  label: '产品ID',
                  key: 'productId$LIKE',
                  type: 'string',
                },
                {
                  label: '设备ID',
                  key: 'deviceId$LIKE',
                  type: 'string',
                },
                {
                  label: '指令类型',
                  key: 'messageType',
                  type: 'string',
                },
                {
                  label: '指令状态',
                  key: 'state',
                  type: 'string',
                },
                {
                  label: '下发时间',
                  key: 'sendTimestamp',
                  type: 'time',
                },
              ]}
            />
            <div>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  setSend(true);
                }}
              >
                下发指令
              </Button>
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <Button icon="menu">
                  其他批量操作
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.StandardTable}>
          <ProTable
            dataSource={result?.data}
            columns={columns}
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys: any) => setDeviceids(selectedRowKeys),
            }}
            onSearch={(params: any) => handleSearch({ ...params, terms: searchParam.terms })}
            paginationConfig={result}
          />
        </div>
      </Card>

      {visible && <Cat close={() => setVisible(false)} data={current} />}
      {send && <Send close={() => setSend(false)} />}
    </PageHeaderWrapper>
  );
};
export default Command;
