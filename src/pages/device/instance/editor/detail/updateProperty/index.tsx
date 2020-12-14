import React, { useEffect } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Input, InputNumber, message, Modal, Select } from 'antd';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

interface Props extends FormComponentProps {
  data?: any;
  close: Function;
  save: (data: any) => void;
}

const UpdateProperty: React.FC<Props> = props => {

  const {
    form: { getFieldDecorator, setFieldsValue },
    form,
  } = props;

  useEffect(() => {
    let valueType: any = props.data.valueType;
    if (valueType.type === 'object') {
      if (!props.data.formatValue) {
        const map = {};
        valueType.properties.forEach((item: any) => {
          map[item.id] = `名称：${item.name}，类型：${item.valueType.type}`;
        });
        setFieldsValue({ 'value': JSON.stringify(map, null, 2) });
      } else {
        setFieldsValue({ 'value': JSON.stringify(JSON.parse(props.data.formatValue), null, 2) });
      }
    } else if (valueType.type === 'boolean') {
      props.data.formatValue ?
        setFieldsValue({ 'value': String(props.data.value) })
        : setFieldsValue({ 'value': props.data.formatValue });
    } else if (valueType.type === 'enum') {
      props.data.formatValue ?
        setFieldsValue({ 'value': props.data.value })
        : setFieldsValue({ 'value': props.data.formatValue });
    } else if (valueType.type === 'array') {
      props.data.formatValue ?
        setFieldsValue({ 'value': JSON.stringify([`类型：${valueType.elementType}`], null, 2) })
        : setFieldsValue({ 'value': props.data.formatValue });
    } else {
      if (valueType.type === 'int' || valueType.type === 'float' || valueType.type === 'double' || valueType.type === 'long') {
        setFieldsValue({ 'value': props.data.value });
      } else {
        setFieldsValue({ 'value': props.data.formatValue });
      }
    }
  }, []);

  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      let map = {};

      let valueType: any = props.data.valueType;

      if (valueType.type === "array" || valueType.type === "object") {
        try {
          fileValue.value = JSON.parse(fileValue.value);
        } catch (e) {
          message.error("JSON格式错误");
          return;
        }
      }

      map[props.data.id] = fileValue.value;
      props.save(map);
    });
  };

  const renderMassageType = (type: string) => {
    let valueType = props.data.valueType;
    switch (type) {
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return (
          <InputNumber placeholder="请输入" style={{ width: '100%' }} />
        );
      case 'string':
      case 'date':
      case 'file':
      case 'password':
      case 'geoPoint':
        return (
          <Input property='请输入' />
        );
      case 'enum':
        return (
          <Select placeholder="请选择">
            {valueType.elements.length > 0 && valueType.elements.map((item: any) => (
              <Select.Option key={item.value} value={item.value}>{`${item.text}（${item.value}）`}</Select.Option>
            ))}
          </Select>
        );
      case 'boolean':
        return (
          <Select placeholder="请选择">
            <Select.Option key={valueType.trueValue} value={valueType.trueValue}>
              {`${valueType.trueText}（${valueType.trueValue}）`}
            </Select.Option>
            <Select.Option key={valueType.falseValue} value={valueType.falseValue}>
              {`${valueType.falseText}（${valueType.falseValue}）`}
            </Select.Option>
          </Select>
        );
      case 'array':
      case 'object':
        return (
          <AceEditor
            mode='json'
            theme="eclipse"
            name="app_code_editor"
            key='deviceShadow'
            fontSize={14}
            showPrintMargin
            showGutter
            wrapEnabled
            highlightActiveLine  //突出活动线
            enableSnippets  //启用代码段
            style={{ width: '100%', height: '50vh' }}
            setOptions={{
              enableBasicAutocompletion: true,   //启用基本自动完成功能
              enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
              enableSnippets: true,  //启用代码段
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title='编辑属性'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        saveData();
      }}
      width="40%"
      onCancel={() => props.close()}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} key='properties_form'>
        <Form.Item key="properties_item" label={props.data.name}>
          {getFieldDecorator('value', {
            rules: [
              { required: true, message: `请输入${props.data.name}` }
            ],
          })(renderMassageType(props.data.valueType.type))}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(UpdateProperty);
