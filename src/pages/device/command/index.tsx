import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import Service from './service';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import Cat from './cat';
import ProTable from '@/pages/system/permission/component/ProTable';
import encodeQueryParam from '@/utils/encodeParam';
import Send from './send';
import moment from 'moment';

const Command = () => {
  const service = new Service('device/message/task');
  const [result, setResult] = useState<any>({});
  const [searchParam, setSearchParam] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
    sorts: { field: 'id', order: 'desc' },
  });
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
      filters: [
        { text: '读取属性', value: 'READ_PROPERTY' },
        { text: '设置属性', value: 'WRITE_PROPERTY' },
        { text: '调用功能', value: 'INVOKE_FUNCTION' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: [
        { text: '等待中', value: 'wait' },
        { text: '发送失败', value: 'sendError' },
        { text: '发送成功', value: 'success' },
      ],
      render: (value: any) => value.text,
    },
    {
      title: '错误信息',
      dataIndex: 'lastError',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTimestamp',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      //   sorter: true,
      //   defaultSortOrder: 'descend',
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

  return (
    <PageHeaderWrapper title="指令下发">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ ...searchParam, terms: { ...params, ...searchParam.terms } });
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
                  label: '下发时间',
                  key: 'sendTimestamp$btw',
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
              {deviceIds.length > 0 ? (
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
              ) : (
                <Button
                  icon="arrow-down"
                  type="danger"
                  onClick={() => {
                    service
                      .sendBatchCommand(encodeQueryParam({ terms: searchParam.terms }))
                      .subscribe(data => {
                        message.success('操作成功');
                      });
                  }}
                >
                  重新发送全部指令
                </Button>
              )}
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
            onSearch={(params: any) => {
              handleSearch({
                ...params,
                terms: { ...searchParam.terms, ...params.terms },
                sorts: searchParam.sorts,
              });
            }}
            paginationConfig={result}
          />
        </div>
      </Card>

      {visible && (
        <Cat
          close={() => {
            setVisible(false);
            handleSearch(searchParam);
          }}
          data={current}
        />
      )}
      {send && (
        <Send
          close={() => {
            setSend(false);
            handleSearch(searchParam);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default Command;
