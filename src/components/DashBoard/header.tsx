import React from 'react';
import Style from './index.less';
import { Col, Form, Row } from 'antd';
import type { TimeType } from './timePicker';
import RangePicker from './timePicker';

export interface HeaderProps {
  title: string;
  /**
   * 参数发生变化时的回调
   * @param data
   */
  onParamsChange: (data: any) => void;
  extraParams?: {
    key: string;
    Children: React.ReactNode;
  };
  initialValues?: any;
  defaultTime?: TimeType;
}

export default (props: HeaderProps) => {
  const [form] = Form.useForm();

  const change = async (data: any) => {
    if (props.onParamsChange) {
      props.onParamsChange(data);
    }
  };

  return (
    <div className={Style.header}>
      <div className={Style.title}>{props.title}</div>
      <div className={Style.form}>
        <Form
          form={form}
          colon={false}
          layout={'inline'}
          preserve={false}
          initialValues={props.initialValues}
          onValuesChange={(_, allValue) => {
            change(allValue);
          }}
        >
          <Row style={{ width: '100%' }}>
            {props.extraParams && (
              <Col span={6}>
                <Form.Item name={props.extraParams.key}>{props.extraParams.Children}</Form.Item>
              </Col>
            )}
            <Col span={props.extraParams ? 18 : 24}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Form.Item noStyle name={'time'}>
                  <RangePicker defaultTime={props.defaultTime} />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};
