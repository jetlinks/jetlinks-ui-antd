import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Button, Card, Col, Drawer, Input, Radio, Row, Select, TreeSelect} from 'antd';
import {DeviceProduct} from '../data';
import {FormItemConfig} from '@/utils/common';
import apis from '@/services';

interface Props extends FormComponentProps {
  // interface Props {
  data?: Partial<DeviceProduct>;
  close: Function;
  save: (data: Partial<DeviceProduct>) => void;
}

interface State {
  protocolSupports: any[];
  protocolTransports: any[];
  organizationList: any[];
  configForm: any[];
  configName: string;
}

const Save: React.FC<Props> = props => {
  const initState: State = {
    protocolSupports: [],
    protocolTransports: [],
    organizationList: [],
    configName: '',
    configForm: [],
  };

  const {getFieldDecorator} = props.form;
  const [messageProtocol, setMessageProtocol] = useState<string>();
  // 消息协议
  const [protocolSupports, setProtocolSupports] = useState(initState.protocolSupports);
  // 消息协议
  const [organizationList, setOrganizationList] = useState(initState.organizationList);
  // 传输协议
  const [protocolTransports, setProtocolTransports] = useState(initState.protocolTransports);

  // 配置名称
  const [configName, setConfigName] = useState(initState.configName);
  // 配置表单
  const [configForm, setConfigForm] = useState(initState.configForm);

  const onMessageProtocolChange = (value: string) => {
    setMessageProtocol(value);
    // 获取链接协议
    apis.deviceProdcut
      .protocolTransports(value)
      .then(e => {
        if (e.status === 200) {
          setProtocolTransports(e.result);
        }
      })
      .catch(() => {
      });
  };

  const parseConfig = (configData: any[]) => {
    const config = configData.map(item => {
      const label = item.name;
      const key = `configuration.${item.property}`;
      const componentType = item.type.id;
      let component = null;
      let options: any = {};
      if (props.data?.configuration) {
        options = {
          initialValue: props.data?.configuration[item.property],
        };
      }
      if (componentType !== 'enum') {
        component = <Input type={componentType === 'password' ? 'password' : 'text'}/>;
      } else {
        const element = item.type.elements;
        component = (
          <Select>
            {(element || []).map((e: any) => (
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
          xl: {span: 8},
          lg: {span: 8},
          md: {span: 12},
          sm: {span: 24},
        },
        options,
        component,
      };
    });

    setConfigForm(config);
  };

  const getProtocolConfig = (messageProtocol: string, transType: string) => {
    apis.deviceProdcut
      .protocolConfiguration(messageProtocol, transType)
      .then(e => {
        if (e.status === 200) {
          if (e.result) {
            if (e.result.properties) {
              parseConfig(e.result.properties);
            }
            setConfigName(e.result.name);
          }
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    apis.deviceProdcut
      .protocolSupport()
      .then(e => {
        if (e.status === 200) {
          setProtocolSupports(e.result);
        }
      })
      .catch(() => {
      });

    apis.deviceProdcut.queryOrganization()
      .then((res: any) => {
        if (res.status === 200) {
          let orgList: any = [];
          res.result.map((item: any) => {
            orgList.push({id: item.id, pId: item.parentId, value: item.id, title: item.name})
          });
          setOrganizationList(orgList);
        }
      }).catch(() => {
    });

    if (props.data && props.data.messageProtocol) {
      onMessageProtocolChange(props.data.messageProtocol);
      if (!props.data.transportProtocol) return;
      getProtocolConfig(props.data.messageProtocol, props.data.transportProtocol);
    }
  }, []);

  const onTransportProtocol = (value: string) => {
    if (!(messageProtocol && value)) return;
    getProtocolConfig(messageProtocol, value);
  };


  const basicForm: FormItemConfig[] = [
    {
      label: '型号ID',
      key: 'id',
      styles: {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      options: {
        initialValue: props.data?.id,
        rules: [{required: true, message: '请输入型号ID'}],
      },

      component: (
        <Input
          placeholder="请输入型号ID "
          disabled={!!props.data?.id}
        />
      ),
    },
    {
      label: '型号名称',
      key: 'name',
      options: {
        rules: [{required: true, message: '请选择型号名称'}],
        initialValue: props.data?.name,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: <Input style={{width: '100%'}} placeholder="请输入"/>,
    },
    {
      label: '所属机构',
      key: 'orgId',
      options: {
        initialValue: props.data?.orgId,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 10},
        md: {span: 24},
        sm: {span: 24},
      },
      component: <TreeSelect allowClear treeDataSimpleMode placeholder="所属机构" treeData={organizationList}/>,
    },
    {
      label: '消息协议',
      key: 'messageProtocol',
      options: {
        rules: [{required: true, message: '请选择消息协议'}],
        initialValue: props.data?.messageProtocol,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: (
        <Select
          placeholder="请选择"
          onChange={(value: string) => {
            onMessageProtocolChange(value);
          }}
        >
          {protocolSupports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '传输协议',
      key: 'transportProtocol',
      options: {
        rules: [{required: true, message: '请选择传输协议'}],
        initialValue: props.data?.transportProtocol,
      },
      styles: {
        xl: {span: 8},
        lg: {span: 10},
        md: {span: 24},
        sm: {span: 24},
      },
      component: (
        <Select
          placeholder="请选择"
          onChange={(value: string) => {
            onTransportProtocol(value);
          }}
        >
          {protocolTransports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },

    {
      label: '设备类型',
      key: 'deviceType',
      options: {
        rules: [{required: true, message: '请选择设备类型'}],
        initialValue:
          typeof props.data?.deviceType === 'string'
            ? props.data?.deviceType
            : (props.data?.deviceType || {}).value,
      },
      styles: {
        lg: {span: 8},
        md: {span: 12},
        sm: {span: 24},
      },
      component: (
        <Radio.Group>
          <Radio value="device">设备</Radio>
          <Radio value="gateway">网关</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '描述',
      key: 'describe',
      styles: {
        xl: {span: 24},
        lg: {span: 24},
        md: {span: 24},
        sm: {span: 24},
      },
      options: {
        initialValue: props.data?.describe,
      },
      component: <Input.TextArea rows={3} placeholder="请输入描述"/>,
    },
  ];

  const saveData = () => {
    const {form} = props;
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (!fileValue.orgId) {
        fileValue.orgId = '';
      }
      props.save({state: 0, ...fileValue});
    });
  };
  return (
    <Drawer
      visible
      title={`${props.data?.id ? '编辑' : '新增'}型号`}
      width={500}
      onClose={() => props.close()}
      closable
    >
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Card title="基本信息" style={{marginBottom: 20}} bordered={false}>
          <Row gutter={16}>
            {basicForm.map(item => (
              <Col
                key={item.key}
                // {...item.styles}
              >
                <Form.Item label={item.label}>
                  {getFieldDecorator(item.key, item.options)(item.component)}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>
        {configName && (
          <Card title={configName} style={{marginBottom: 20}} bordered={false}>
            <Row gutter={16}>
              {configForm.map(item => (
                <Col
                  key={item.key}
                  // {...item.styles}
                >
                  <Form.Item label={item.label}>
                    {getFieldDecorator(item.key, item.options)(item.component)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
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
          style={{marginRight: 8}}
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

export default Form.create<Props>()(Save);
