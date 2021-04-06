import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Button, Card, Col, Drawer, Icon, Input, Modal, Row, Select, Tooltip } from 'antd';
import { DeviceInstance } from '@/pages/device/instance/data';

interface Props extends FormComponentProps {
  data?: Partial<DeviceInstance>;
  configuration?: any;
  close: Function;
  save: (data: Partial<DeviceInstance>) => void;
}

interface State {
  protocolSupports: any[];
  protocolTransports: any[];
  organizationList: any[];
  configForm: any[];
  configName: string;
}

const Configuration: React.FC<Props> = props => {
  const initState: State = {
    protocolSupports: [],
    protocolTransports: [],
    organizationList: [],
    configName: '',
    configForm: [],
  };

  const { getFieldDecorator } = props.form;
  // 配置名称
  // const [configName, setConfigName] = useState(initState.configName);
  // 配置表单
  const [configForm, setConfigForm] = useState(initState.configForm);

  const parseConfig = (configData: any[]) => {
    const config = configData.map(i => {
      const configName = i.name
      let properties = i.properties.map((item: any) => {
        const label = item.description ? (
          <span>
            <span style={{marginRight: '10px'}}>{item.name}</span>
            <Tooltip title={item.description}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>) : item.name
        const key = `configuration.${item.property}`;
        const componentType = item.type.id;
        let component = null;
        const options = {
          initialValue: props.data?.configuration[item.property],
        };
        if (componentType !== 'enum') {
          component = componentType === 'password' ? <Input.Password /> : <Input type={'text'} />;
        } else {
          const o = item.type.elements;
          component = (
            <Select>
              {(o || []).map((e: any) => (
                <Select.Option key={e.value} value={e.value}>
                  {e.text}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return {
          label,
          key,
          styles: {
            xl: { span: 8 },
            lg: { span: 8 },
            md: { span: 12 },
            sm: { span: 24 },
          },
          options,
          component,
        };
      })
      return {
        configName,
        properties
      }
    });
    setConfigForm(config);
  };

  useEffect(() => {
    // setConfigName(props.configuration.name);
    // parseConfig(props.configuration.properties)
    parseConfig(props.configuration)
  }, []);


  const saveData = () => {
    const { form } = props;
    form.validateFields((err, fileValue) => {
      if (err) return;
      props.save(fileValue);
    });
  };

  return (
    <Drawer
      // title='编辑配置'
      // visible
      // okText="确定"
      // cancelText="取消"
      // onOk={() => {
      //   saveData();
      // }}
      // onCancel={() => props.close()}
      title='编辑配置'
      visible
      width={500}
      onClose={() => props.close()}
      closable
    >
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        {/* {configName && (
          <Card title={configName} style={{ marginBottom: 20 }} bordered={false}>
            <Row gutter={16}>
              {configForm.map(item => (
                <Col key={item.key}>
                  <Form.Item label={item.label}>
                    {getFieldDecorator(item.key, item.options)(item.component)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        )} */}
        {configForm && (
          // <Card title="配置" style={{ marginBottom: 20 }} bordered={false}>
          <Row gutter={16}>
            {configForm.map((item, index) => (
              <Col key={index}>
                <h4>{item.configName}</h4>
                {item.properties.map((i: any) => (
                  <Col key={i.key}>
                    <Form.Item label={i.label}>
                      {getFieldDecorator(i.key, i.options)(i.component)}
                    </Form.Item>
                  </Col>
                ))}
              </Col>
            ))}
          </Row>
          // </Card>
        )}
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
                </Button>
        <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
                </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<Props>()(Configuration);
