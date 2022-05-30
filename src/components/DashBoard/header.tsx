import React, { useEffect, useState } from 'react';
import Style from './index.less';
import { Col, DatePicker, Form, Input, Radio, Row } from 'antd';
import moment from 'moment';

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
}

export default (props: HeaderProps) => {
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState<string | undefined>('today');

  const change = async () => {
    const data = await form.getFieldsValue();
    data.time = [data.time[0].valueOf(), data.time[1].valueOf()];
    if (props.onParamsChange) {
      props.onParamsChange(data);
    }
  };
  const setTime = (sTime: number, eTime: number) => {
    form.setFieldsValue({ time: [moment(sTime), moment(eTime)] });
  };

  useEffect(() => {
    setTime(moment().startOf('day').valueOf(), new Date().getTime());
    setRadioValue('today');
    change();
  }, []);

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
          onValuesChange={() => {
            change();
          }}
        >
          <Row style={{ width: '100%' }}>
            {props.extraParams && (
              <Col span={6}>
                <Form.Item name={props.extraParams.key}>{props.extraParams.Children}</Form.Item>
              </Col>
            )}
            <Col span={props.extraParams ? 18 : 24}>
              <Form.Item noStyle>
                <Input.Group compact>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Radio.Group
                      defaultValue="day"
                      buttonStyle="solid"
                      value={radioValue}
                      onChange={(e) => {
                        let startTime: any = 0;
                        const endTime = moment(new Date());
                        const value = e.target.value;
                        if (value === 'today') {
                          startTime = moment().startOf('day').valueOf();
                        } else if (value === 'week') {
                          startTime = moment().subtract(6, 'days').valueOf();
                        } else if (value === 'month') {
                          startTime = moment().subtract(29, 'days').valueOf();
                        } else {
                          startTime = moment().subtract(365, 'days').valueOf();
                        }
                        setRadioValue(value);
                        form.setFieldsValue({ time: [moment(startTime), moment(endTime)] });
                        change();
                      }}
                    >
                      <Radio.Button value="today">当天</Radio.Button>
                      <Radio.Button value="week">近一周</Radio.Button>
                      <Radio.Button value="month">近一月</Radio.Button>
                      <Radio.Button value="year">近一年</Radio.Button>
                    </Radio.Group>
                    <Form.Item name={'time'} noStyle>
                      {
                        // @ts-ignore
                        <DatePicker.RangePicker
                          showTime
                          onChange={(date: any) => {
                            if (date) {
                              setRadioValue(undefined);
                            }
                          }}
                        />
                      }
                    </Form.Item>
                  </div>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};
