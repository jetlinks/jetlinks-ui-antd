import React, {useEffect, useState} from 'react';
import {Col, DatePicker, Form, Modal, Row, Table} from 'antd';
import {ColumnProps, PaginationConfig} from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import moment, {Moment} from 'moment';
import {FormComponentProps} from "antd/es/form";

interface Props extends FormComponentProps {
  close: Function;
  item: any;
  type: string;
  deviceId: string;
}

interface State {
  eventColumns: ColumnProps<any>[];
  propertiesInfo: any;
}

const PropertiesInfo: React.FC<Props> = props => {

  const {
    form: {getFieldDecorator},
    form,
  } = props;
  const initState: State = {
    eventColumns: [
      {
        title: '时间',
        dataIndex: 'timestamp',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: props.item.name,
        dataIndex: 'formatValue',
        ellipsis: true,
      },
    ],
    propertiesInfo: {},
  };

  const [propertiesInfo, setPropertiesInfo] = useState(initState.propertiesInfo);

  const handleSearch = (params?: any) => {
    apis.deviceInstance
      .propertieInfo(
        props.deviceId,
        encodeQueryParam(params),
      )
      .then(response => {
        if (response.status === 200) {
          setPropertiesInfo(response.result);
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {property: props.item.id},
    });
  }, []);

  const onTableChange = (pagination: PaginationConfig) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {property: props.item.id},
    });
  };

  const onSearch = () => {
    const params = form.getFieldsValue();
    if (params.createTime$BTW) {
      const formatDate = params.createTime$BTW.map((e: Moment) =>
        moment(e).format('YYYY-MM-DD HH:mm:ss'),
      );
      params.createTime$BTW = formatDate.join(',');
    }
    handleSearch({
      pageIndex: 0,
      pageSize: 10,
      sorts: {
        field: 'timestamp',
        order: 'desc',
      },
      terms: {...params, property: props.item.id},
    });
  };

  return (
    <Modal
      title="属性详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width="70%"
    >
      <Form labelCol={{span: 0}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 4, xl: 48}}>
          <Col md={10} sm={24}>
            <Form.Item>
              {getFieldDecorator('createTime$BTW')(
                <DatePicker.RangePicker
                  showTime={{format: 'HH:mm:ss'}}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={(value: any[]) => {
                    if (value.length === 0) {
                      handleSearch({
                        pageIndex: 0,
                        pageSize: 10,
                        sorts: {
                          field: 'timestamp',
                          order: 'desc',
                        },
                        terms: {property: props.item.id},
                      });
                    }
                  }}
                  onOk={onSearch}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="createTime"
        dataSource={propertiesInfo.data}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: propertiesInfo.pageIndex + 1,
          total: propertiesInfo.total,
          pageSize: propertiesInfo.pageSize,
          simple: true
        }}
        columns={initState.eventColumns}
      />
    </Modal>
  );
};

export default Form.create<Props>()(PropertiesInfo);
