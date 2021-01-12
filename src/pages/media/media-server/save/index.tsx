import {Col, Input, InputNumber, Modal, Row, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import Service from "../service";
import Form from "antd/es/form";
import {FormComponentProps} from "antd/lib/form";

interface Props extends FormComponentProps {
  data: any;
  close: Function;
  save: Function;
}

interface State {
  item: any;
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    item: props.data,
  };

  const {form: {getFieldDecorator}, form} = props;
  const service = new Service('media/server');

  const [item, setItem] = useState(initState.item);
  const [providersList, setProvidersList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const initValue = () => {
    service.providersList().subscribe(data => {
      setProvidersList(data);
    }, () => {
    }, () => setLoading(false));
  };

  useEffect(() => initValue(), [loading]);

  const saveData = () => {
    const id = props.data?.id;

    form.validateFields((err,fileValue) => {
      if (err) return;

      props.save({...fileValue, id});
    });
  };

  const renderConfig = () => {
    const {provider} = item;
    const configuration = props.data.configuration ?
      (typeof props.data.configuration === "string" ? JSON.parse(props.data.configuration) : props.data.configuration)
      : {};
    switch (provider) {
      case 'srs-media':
        return (
          <div>
            <Col span={12}>
              <Form.Item label="公网 Host" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.publicHost', {
                  rules: [
                    {required: true, message: '请输入公网 Host'}
                  ],
                  initialValue: configuration.publicHost,
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="API Host" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.apiHost', {
                  initialValue: configuration.apiHost,
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="API端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.apiPort', {
                  initialValue: configuration.apiPort,
                })(<InputNumber style={{width: '100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="RTP端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.rtpPort', {
                  initialValue: configuration.rtpPort,
                })(<InputNumber style={{width: '100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="HTTP端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.httpPort', {
                  initialValue: configuration.httpPort,
                })(<InputNumber style={{width: '100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="RTMP端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.rtmpPort', {
                  initialValue: configuration.rtmpPort,
                })(<InputNumber style={{width: '100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="流ID前缀" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('configuration.streamIdPrefix', {
                  initialValue: configuration.streamIdPrefix,
                })(<Input/>)}
              </Form.Item>
            </Col>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      width='50VW'
      title={`${props.data?.id ? '编辑' : '新建'}`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        saveData();
      }}
      onCancel={() => props.close()}
    >
      <Spin spinning={loading}>
        <Form labelCol={{span: 3}} wrapperCol={{span: 21}}>
          <Row>
            <Col span={12}>
              <Form.Item key="name" label="流媒体名称" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('name', {
                  rules: [
                    {required: true, message: '请输入流媒体名称'},
                    {max: 200, message: '流媒体名称不超过200个字符'}
                  ],
                  initialValue: props.data?.id,
                })(<Input placeholder="请输入流媒体名称"/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="provider" label="服务商" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                {getFieldDecorator('provider', {
                  rules: [{required: true, message: '请选择服务商'}],
                  initialValue: props.data?.provider,
                })(
                  <Select placeholder="服务商" onChange={(e) => {
                    setItem({provider: e})
                  }}>
                    {(providersList || []).map(item => (
                      <Select.Option
                        key={JSON.stringify({providerId: item.id, providerName: item.name})}
                        value={item.id}
                      >
                        {`${item.name}(${item.id})`}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {renderConfig()}
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
};

export default Form.create<Props>()(Save);
