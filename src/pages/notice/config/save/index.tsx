import { Modal, Form, Input, Select, Card, Col, Icon, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';
import { randomString } from '@/utils/utils';
import encodeQueryParam from '@/utils/encodeParam';

interface Props extends FormComponentProps {
  data: any;
  close: Function;
  save: Function;
}
interface State {
  item: any;
  typeList: any[];
  metadata: any;
  otherConfig: {
    id: string;
    name: string;
    value: string;
    description: string;
  }[];
}
const Save: React.FC<Props> = props => {
  const initState: State = {
    item: props.data,
    typeList: [],
    metadata: {},
    otherConfig: props.data?.configuration?.properties || [
      {
        id: randomString(8),
        name: '',
        value: '',
        description: '',
      },
    ],
  };

  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [item, setItem] = useState(initState.item);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [metadata, setMetadata] = useState(initState.metadata);
  const [otherConfig, setOtherConfig] = useState(initState.otherConfig);
  const [networkList, setNetworkList] = useState<any[]>([]);
  const getMetadata = (provider?: string) => {
    apis.notifier.configMetadata(item.type, provider || item.provider).then(res => {
      setMetadata(res.result);
    });
    apis.network.list(encodeQueryParam({
      paging: false,
      sorts: {
        field: 'id',
        order: 'desc'
      },
      terms: {
        type: provider || item.provider
      }
    })).then(resp => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
      }
    })
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

  const getDataType = (j: any) => {
    const {
      property,
      type: { type },
    } = j;

    switch (type) {
      case 'int':
      case 'string':
      case 'number':
      case 'password':
        if (property === 'networkId') {
          return (
            <Select>
              {networkList.map(i => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
            </Select>
          )
        }
        return <Input />;
      case 'array':
        if (property && property === 'properties') {
          const properties = otherConfig;
          return (
            <Card>
              {properties.map((i, index) => {
                return (
                  <Row key={i.id} style={{ marginBottom: 5 }}>
                    <Col span={6}>
                      <Input
                        value={i.name}
                        onChange={e => {
                          otherConfig[index].name = e.target.value;
                          setOtherConfig([...otherConfig]);
                        }}
                        placeholder="key"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center' }}>
                      <Icon type="double-right" />
                    </Col>
                    <Col span={6}>
                      <Input
                        value={i.value}
                        onChange={e => {
                          otherConfig[index].value = e.target.value;
                          setOtherConfig([...otherConfig]);
                        }}
                        placeholder="value"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center' }}>
                      <Icon type="double-right" />
                    </Col>
                    <Col span={6}>
                      <Input
                        value={i.description}
                        onChange={e => {
                          otherConfig[index].description = e.target.value;
                          setOtherConfig([...otherConfig]);
                        }}
                        placeholder="说明"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center' }}>
                      {index === 0 ? (
                        <Icon
                          type="plus"
                          onClick={() => {
                            otherConfig.push({
                              id: randomString(8),
                              name: '',
                              value: '',
                              description: '',
                            });
                            setOtherConfig([...otherConfig]);
                          }}
                        />
                      ) : (
                          <Icon
                            type="minus"
                            onClick={() => {
                              const config = otherConfig.filter(temp => temp.id !== i.id);
                              // debugData.headers.push({ id: randomString(8), key: '', value: '' });
                              setOtherConfig([...config]);
                            }}
                          />
                        )}
                    </Col>
                  </Row>
                )
              })}
            </Card>
          );
        }
      default:
        return <p>缺少</p>;
    }
  };

  const renderConfig = () => {
    if (metadata && metadata.properties) {
      return metadata.properties.map((i: any) => (
        <Form.Item label={i.name} key={i.property}>
          {form.getFieldDecorator(`configuration.${i.property}`, {
            initialValue: item.configuration && item.configuration[i.property],
          })(getDataType(i))}
        </Form.Item>
      ));
    }
    return null;
  };

  const saveData = () => {
    const id = props.data?.id;
    // const data = form.getFieldsValue();

    form.validateFields((err, fileValue) => {
      const data = fileValue;
      if (err) return;
      const { configuration } = data;
      if (data.type === 'email') {
        configuration.properties = otherConfig;
      }
      data.configuration = configuration;
      data.template = JSON.stringify(data.template);
      props.save({ ...data, id });
    });
  };

  return (
    <Modal
      visible
      title="编辑通知配置"
      onCancel={() => props.close()}
      onOk={() => {
        saveData();
      }}
      width={840}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="配置名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入配置名称' }],
            initialValue: item?.name,
          })(<Input />)}
        </Form.Item>

        <Form.Item label="通知类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入通知类型' }],
            initialValue: item?.type,
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
            initialValue: item?.provider,
          })(
            <Select
              onChange={(e: string) => {
                getMetadata(e);
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
