import { Modal, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';

interface Props extends FormComponentProps {
  data: any;
  close: Function;
  save: Function;
}
interface State {
  item: any;
  typeList: any[];
  metadata: any;
}
const Save: React.FC<Props> = props => {
  const initState: State = {
    item: props.data,
    typeList: [],
    metadata: {},
  };

  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [item, setItem] = useState(initState.item);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [metadata, setMetadata] = useState(initState.metadata);

  const getMetadata = () => {
    apis.notifier.configMetadata(item.type, item.provider).then(res => {
      setMetadata(res.result);
    });
  };

  useEffect(() => {
    if (item.id) {
      apis.notifier.queryConfigById(item.id).then(res => {
        if (res) {
          setItem(res.result);
        }
      });
      getMetadata();
    }

    apis.notifier.configType().then((res: any) => {
      if (res) {
        setTypeList(res.result);
      }
    });
  }, []);

  const getDataType = (i: any) => {
    const {
      type: { type },
    } = i;

    switch (type) {
      case 'int':
      case 'string':
      case 'number':
      case 'password':
        return <Input />;
      default:
        return <p>缺少</p>;
    }
  };

  const renderConfig = () => {
    if (metadata && metadata.properties) {
      return metadata.properties.map((i: any) => (
        <Form.Item label={i.name} key={i.property}>
          {form.getFieldDecorator(`configuration.${i.property}`, {
            initialValue: item.configuration[i.property],
          })(getDataType(i))}
        </Form.Item>
      ));
    }
    return null;
  };

  const saveData = () => {
    const id = props.data?.id;
    const data = form.getFieldsValue();
    data.template = JSON.stringify(data.template);
    props.save({ ...data, id });
  };

  return (
    <Modal
      visible
      title="编辑通知模版"
      onCancel={() => props.close()}
      onOk={() => {
        saveData();
      }}
      width={640}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="模版名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模版名称' }],
            initialValue: item.name,
          })(<Input />)}
        </Form.Item>

        <Form.Item label="通知类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入通知类型' }],
            initialValue: item.type,
          })(
            <Select onChange={e => setItem({ type: e })}>
              {typeList.map(i => (
                <Select.Option key={i.id} value={i.id}>
                  {i.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="服务商">
          {getFieldDecorator('provider', {
            rules: [{ required: true, message: '请选择服务商' }],
            initialValue: item.provider,
          })(
            <Select
              onChange={() => {
                getMetadata();
              }}
            >
              {(typeList.find(i => i.id === item.type)?.providerInfos || []).map((e: any) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {renderConfig()}
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
