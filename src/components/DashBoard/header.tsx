import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Style from './index.less';
import { Col, Form, Radio, Row } from 'antd';
import type { TimeType } from './timePicker';
import RangePicker, { TimeKey } from './timePicker';

interface timeToolOptions {
  label: string;
  value: string;
}

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
  /**
   * true 关闭初始化时触发onParamsChange
   */
  closeInitialParams?: boolean;
  defaultTime?: TimeType & string;
  showTime?: boolean;
  showTimeTool?: boolean;
  timeToolOptions?: timeToolOptions[];
}

export default forwardRef((props: HeaderProps, ref) => {
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState<TimeType | undefined>(undefined);
  const isCloseInitial = useRef<boolean>(false);
  const pickerRef = useRef<any>(null);

  const change = async (data: any) => {
    if (props.onParamsChange) {
      props.onParamsChange(data);
    }
  };

  useImperativeHandle(ref, () => ({
    getValues: form.getFieldsValue,
  }));

  useEffect(() => {
    setRadioValue(props.defaultTime || TimeKey.today);
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
          onValuesChange={(_, allValue) => {
            console.log(allValue, 'allValue');
            if (props.closeInitialParams && !isCloseInitial.current) {
              isCloseInitial.current = true;
            } else {
              change(allValue);
            }
          }}
        >
          <Row style={{ width: '100%' }}>
            {props.extraParams && (
              <Col span={6}>
                <Form.Item name={props.extraParams.key}>{props.extraParams.Children}</Form.Item>
              </Col>
            )}
            <Col span={props.extraParams ? 18 : 24}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                {props.showTimeTool ? (
                  <Radio.Group
                    defaultValue="day"
                    buttonStyle="solid"
                    value={radioValue}
                    onChange={(e) => {
                      setRadioValue(e.target.value);
                      if (pickerRef.current) {
                        pickerRef.current.timeChange(e.target.value);
                      }
                    }}
                  >
                    {props.timeToolOptions && Array.isArray(props.timeToolOptions) ? (
                      props.timeToolOptions.map((item) => (
                        <Radio.Button value={item.value}>{item.label}</Radio.Button>
                      ))
                    ) : (
                      <>
                        <Radio.Button value={TimeKey.today}>今日</Radio.Button>
                        <Radio.Button value={TimeKey.week}>近一周</Radio.Button>
                        <Radio.Button value={TimeKey.month}>近一月</Radio.Button>
                        <Radio.Button value={TimeKey.year}>近一年</Radio.Button>
                      </>
                    )}
                  </Radio.Group>
                ) : null}
                <Form.Item noStyle name={'time'}>
                  <RangePicker
                    ref={pickerRef}
                    defaultTime={props.defaultTime}
                    timeToolOptions={props.timeToolOptions}
                    showTime={props.showTime}
                    showTimeTool={props.showTimeTool}
                    pickerTimeChange={() => {
                      setRadioValue(undefined);
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
});
