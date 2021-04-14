import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Button, Card, Col, Drawer, Dropdown, Icon, Input, Menu, Row, Select, Tooltip } from 'antd';
import { DeviceProduct } from "@/pages/device/product/data";

interface Props extends FormComponentProps {
  data?: Partial<DeviceProduct>;
  configuration?: any;
  close: Function;
  save: Function;
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
    const config = configData.map(item => {
      const configName = item.name;
      let properties = item.properties.map((i: any) => {
        const label = i.description ? (
          <span>
            <span style={{ marginRight: '10px' }}>{i.name}</span>
            <Tooltip title={i.description}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>) : i.name
        const key = `configuration.${i.property}`;
        const componentType = i.type.id;
        let component = null;
        const options = {
          initialValue: props.data?.configuration ? props.data?.configuration[i.property] : undefined,
        };

        if (componentType !== 'enum') {
          component = componentType === 'password' ? <Input.Password /> : <Input type={'text'} />;
        } else {
          const o = i.type.elements;
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
          component
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
    // setConfigName(props.configuration[0].name);
    parseConfig(props.configuration)
  }, []);


  const saveData = (onlySave: boolean) => {
    const { form } = props;
    form.validateFields((err, fileValue) => {
      if (err) return;
      props.save(onlySave, fileValue);
    });
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button type="default" onClick={() => {
          saveData(true);
        }}>
          仅保存
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button onClick={() => {
          saveData(false);
        }}>保存并生效</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Drawer
      title='编辑配置'
      visible
      width={500}
      onClose={() => props.close()}
      closable
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
        <Dropdown overlay={menu}>
          <Button icon="menu" type="primary">
            保存<Icon type="down" />
          </Button>
        </Dropdown>
        {/* <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
                </Button> */}
      </div>
    </Drawer>
  );
};

export default Form.create<Props>()(Configuration);
