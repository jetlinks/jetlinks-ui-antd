import React, { Fragment, useEffect, useState } from 'react';
import { Table, Card, Form, Row, Col, Button, DatePicker, Modal, Select } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { FormComponentProps } from 'antd/es/form';
import moment, { Moment } from 'moment';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import Service from '../service';

interface Props extends FormComponentProps {
  deviceId: string;
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

  const [logType, setLogType] = useState<any[]>([]);
  const loadLogData = (param: any) => {
    apis.deviceInstance
      .logs(props.deviceId, encodeQueryParam(param))
      .then(response => {
        if (response.status === 200) {
          setLog(response.result);
        }
      })
      .catch(() => { });
  };

  const service = new Service();

  useEffect(() => {
    loadLogData({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
    });
    service.getLogType().subscribe((data) => {
      setLogType(data.result.map((item: { value: string, text: string }) => ({ id: item.value, name: item.text })));
    });
  }, []);

  const column: ColumnProps<any>[] = [
    {
      dataIndex: 'type.text',
      title: '类型',
    },
    {
      dataIndex: 'timestamp',
      title: '时间',
      defaultSortOrder: 'descend',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
          // eslint-disable-next-line prefer-destructuring
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
    // eslint-disable-next-line no-shadow
    const params = form.getFieldsValue();
    if (params.timestamp$BTW) {
      const formatDate = params.timestamp$BTW.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      params.timestamp$BTW = formatDate.join(',');
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
        field: 'timestamp',
        order: 'desc',
      },
    });
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
        field: 'timestamp',
        order: 'desc',
      },
    });
  };
  const onTableChange = (pagination: PaginationConfig) => {
    loadLogData({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: params,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
    });
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
                      {logType.map(item => (
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
                  {getFieldDecorator('timestamp$BTW')(
                    <DatePicker.RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['开始时间', '结束时间']}
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
            showTotal: (total: number) =>
              `共 ${total} 条记录 第  ${log.pageIndex + 1}/${Math.ceil(
                log.total / log.pageSize,
              )}页`,
          }}
        />
      </Card>
    </div>
  );
};

export default Form.create<Props>()(Log);
