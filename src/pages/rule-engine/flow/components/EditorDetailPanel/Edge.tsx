import { Form, Select, Input, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormComponentProps } from 'antd/es/form';

interface Props extends FormComponentProps {
  model: any;
  save: Function;
}
interface State {
  type: string | undefined;
}
const Edge: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const initState: State = {
    type: props.model?._type,
  };
  const [type, setType] = useState(initState.type);

  useEffect(() => {
    setType(props.model?._type);
  }, []);
  const saveModelData = () => {
    const temp = form.getFieldsValue();
    props.save({ ...temp });
    // props.close();
  };
  const renderEventItem = () => {
    if ((type || props.model?._type) === 'event') {
      return (
        <Form.Item label="事件">
          {getFieldDecorator('event', {
            initialValue: props.model?.event,
          })(
            <Select
              onChange={() => {
                saveModelData();
              }}
            >
              {[
                { id: 'NODE_EXECUTE_BEFORE', text: '执行之前' },
                { id: 'NODE_EXECUTE_DONE', text: '执行之后' },
                { id: 'NODE_EXECUTE_FAIL', text: '执行失败' },
              ].map(i => (
                <Select.Option key={i.id} value={i.id}>
                  {i.text}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      );
    }
    return null;
  };
  return (
    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
      <Form.Item label="类型">
        {getFieldDecorator('_type', {
          initialValue: props.model?._type,
        })(
          <Radio.Group
            onChange={e => {
              saveModelData();
              setType(e.target.value);
            }}
          >
            <Radio value="link">连接</Radio>
            <Radio value="event">事件</Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      {renderEventItem()}
      <Form.Item label="标签">
        {getFieldDecorator('label', {
          initialValue: props.model?.label,
        })(
          <Input
            onBlur={() => {
              saveModelData();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="颜色">
        {getFieldDecorator('color', {
          initialValue: props.model?.color,
        })(
          <Input
            onBlur={() => {
              saveModelData();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="条件类型" style={{ display: 'none' }}>
        {getFieldDecorator('condition.type', {
          initialValue: 'script',
        })(<Input />)}
      </Form.Item>

      <Form.Item label="条件语言" style={{ display: 'none' }}>
        {getFieldDecorator('condition.configuration.lang', {
          initialValue: 'js',
        })(<Input />)}
      </Form.Item>
      <Form.Item label="条件">
        {getFieldDecorator('condition.configuration.script', {
          initialValue: props.model?.condition?.configuration?.script,
        })(
          <Input.TextArea
            rows={3}
            onBlur={() => {
              saveModelData();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="说明">
        {getFieldDecorator('description', {
          initialValue: props.model?.description,
        })(
          <Input.TextArea
            rows={3}
            onBlur={() => {
              saveModelData();
            }}
          />,
        )}
      </Form.Item>
    </Form>
  );
};
export default Form.create<Props>()(Edge);
