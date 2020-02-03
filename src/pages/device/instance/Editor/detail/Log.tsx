import { Component, Fragment, useEffect, useState } from 'react';
import React from 'react';
import {
  Table,
  Divider,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Modal,
  Select,
} from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { FormComponentProps } from 'antd/es/form';
import moment, { Moment } from 'moment';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  deviceId: string;
  // data: any;
  // search: Function
}
interface State {
  log: any;
}

const Log: React.FC<Props> = props => {
  const initState: State = {
    log: {},
  };

  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [params, setParams] = useState({ deviceId: props.deviceId });
  const [log, setLog] = useState(initState.log);

  useEffect(() => {
    loadLogData({
      pageIndex: 0,
      pageSize: 10,
      terms: {
        deviceId: props.deviceId,
      },
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    });
  }, []);

  const loadLogData = (param: any) => {
    apis.deviceInstance
      .logs(encodeQueryParam(param))
      .then(response => {
        setLog(response.result);
      })
      .catch(() => {});
  };

  const column: ColumnProps<any>[] = [
    {
      dataIndex: 'type.text',
      title: '类型',
    },
    {
      dataIndex: 'createTime',
      title: '时间',
      render: text => moment(text).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      dataIndex: 'content',
      title: '内容',
      ellipsis: true,
    },
    {
      dataIndex: 'option',
      title: '操作',
      width: '250px',
      align: 'center',
      render: (text, record) => {
        let content = '';
        try {
          content = JSON.stringify(JSON.parse(record.content), null, 2);
        } catch (error) {
          content = record.content;
        }
        return (
          <Fragment>
            <a
              onClick={() =>
                Modal.confirm({
                  width: '50VW',
                  title: '详细信息',
                  content: <pre>{content}</pre>,
                  okText: '确定',
                  cancelText: '关闭',
                })
              }
            >
              查看
            </a>
          </Fragment>
        );
      },
    },
  ];

  const onSearch = () => {
    const params = form.getFieldsValue();
    if (params.createTime$BTW) {
      const formatDate = params.createTime$BTW.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      params.createTime$BTW = formatDate.join(',');
    }
    if (params.type$IN) {
      params.type$IN = params.type$IN.join(',');
    }
    // setParams(params);
    setParams({ ...params, deviceId: props.deviceId });
    loadLogData({
      pageSize: 10,
      pageIndex: 0,
      terms: { ...params, deviceId: props.deviceId },
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    });

    // props.search({
    //     pageIndex: props.data.pageIndex,
    //     pageSize: props.data.pageSize,
    //     terms: params,
    // });
  };

  const resetSearch = () => {
    form.resetFields();
    loadLogData({
      pageIndex: 0,
      pageSize: 10,
      terms: {
        deviceId: props.deviceId,
      },
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    });
  };

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: any, extra: any) => {
    loadLogData({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: params,
      sorts: {
        field: 'createTime',
        order: 'desc',
      },
    });
    // props.search({
    //     pageIndex: Number(pagination.current) - 1,
    //     pageSize: pagination.pageSize,
    //     terms: params,
    //     sorts: sorter,
    // });
  };

  return (
    <div>
      <Card bordered={false}>
        <div>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Row gutter={{ md: 8, lg: 4, xl: 48 }}>
              <Col md={8} sm={24}>
                <Form.Item label="日志类型">
                  {getFieldDecorator('type$IN')(
                    <Select mode="multiple">
                      {[
                        { id: 'event', name: '事件上报' },
                        { id: 'readProperty', name: '属性读取' },
                        { id: 'writeProperty', name: '属性修改' },
                        { id: 'reportProperty', name: '属性上报' },
                        { id: 'call', name: '调用' },
                        { id: 'reply', name: '回复' },
                        { id: 'offline', name: '下线' },
                        { id: 'online', name: '上线' },
                        { id: 'other', name: '其它' },
                      ].map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col md={10} sm={24}>
                <Form.Item label="日期">
                  {getFieldDecorator('createTime$BTW')(
                    <DatePicker.RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['开始时间', '结束时间']}
                      // onChange={() => onChange}
                      // onOk={() => onOk}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col md={6} sm={24}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'right', marginBottom: 24 }}>
                    <Button
                      icon="search"
                      type="primary"
                      onClick={() => {
                        onSearch();
                      }}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        resetSearch();
                      }}
                    >
                      重置
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey="id"
          columns={column}
          dataSource={log.data}
          onChange={onTableChange}
          pagination={{
            current: log.pageIndex + 1,
            total: log.total,
            pageSize: log.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total: number) => {
              return (
                `共 ${total} 条记录 第  ` +
                (log.pageIndex + 1) +
                '/' +
                Math.ceil(log.total / log.pageSize) +
                '页'
              );
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Form.create<Props>()(Log);
