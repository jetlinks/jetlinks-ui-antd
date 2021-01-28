import {Button, Col, Input, InputNumber, message, Row, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import Service from "../service";
import Form from "antd/es/form";
import {FormComponentProps} from "antd/lib/form";

interface Props extends FormComponentProps {
  loading: boolean
}

interface State {
  item: any;
  loading: boolean;
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    item: {},
    loading: props.loading
  };

  const {form: {getFieldDecorator}, form} = props;
  const service = new Service('media/server');

  const [item, setItem] = useState(initState.item);
  const [providersList, setProvidersList] = useState<any[]>([]);

  const id = 'gb28181_MediaServer';
  const [loading, setLoading] = useState<boolean>(initState.loading);

  const initValue = () => {
    service.mediaServerInfo(id).subscribe(data => {
      setItem(data);
    }, () => {
    }, () => setLoading(false));

    service.providersList().subscribe(data => {
      setProvidersList(data);
    }, () => {
    }, () => setLoading(false));
  };

  useEffect(() => {
    initValue();
  }, [props.loading]);

  const saveData = () => {

    form.validateFields((err, fileValue) => {
      if (err) return;

      //todo 统一界面，后期有需求就开放多网关和流媒体服务

      fileValue.id = id;
      service.saveMediaServer(fileValue).subscribe(() => {
          message.success('保存成功');
        },
        () => {
          message.error('保存失败');
        },
        () => {
          initValue();
        });
    });
  };

  const renderConfig = () => {
    const {provider} = item;
    const configuration = item.configuration ?
      (typeof item.configuration === "string" ? JSON.parse(item.configuration) : item.configuration)
      : {};
    switch (provider) {
      case 'srs-media':
        return (
          <div>
            <Form.Item label="公网 Host">
              {getFieldDecorator('configuration.publicHost', {
                rules: [
                  {required: true, message: '请输入公网 Host'}
                ],
                initialValue: configuration.publicHost,
              })(<Input placeholder='请输入公网 Host'/>)}
            </Form.Item>
            <Form.Item label="API Host">
              {getFieldDecorator('configuration.apiHost', {
                rules: [
                  {required: true, message: '请输入API Host'}
                ],
                initialValue: configuration.apiHost,
              })(<Input placeholder='请输入API Host'/>)}
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item label="API端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.apiPort', {
                    rules: [
                      {required: true, message: '请输入API端口'}
                    ],
                    initialValue: configuration.apiPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入API端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RTP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.rtpPort', {
                    rules: [
                      {required: true, message: '请输入RTP端口'}
                    ],
                    initialValue: configuration.rtpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入RTP端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HTTP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.httpPort', {
                    rules: [
                      {required: true, message: '请输入HTTP端口'}
                    ],
                    initialValue: configuration.httpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入HTTP端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RTMP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.rtmpPort', {
                    rules: [
                      {required: true, message: '请输入RTMP端口'}
                    ],
                    initialValue: configuration.rtmpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入RTMP端口'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="流媒体格式">
              {getFieldDecorator('configuration.formats', {
                rules: [
                  {required: true, message: '请选择流媒体格式'}
                ],
                initialValue: configuration.formats,
              })(<Select placeholder="请选择流媒体格式，多选" mode='multiple'>
                <Select.Option value='flv'>FLV</Select.Option>
                <Select.Option value='mp4'>MP4</Select.Option>
                <Select.Option value='hls'>HLS</Select.Option>
                <Select.Option value='ts'>TS</Select.Option>
                <Select.Option value='rtc'>RTC</Select.Option>
              </Select>)}
            </Form.Item>
            <Form.Item label="流ID前缀">
              {getFieldDecorator('configuration.streamIdPrefix', {
                initialValue: configuration.streamIdPrefix,
              })(<Input/>)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Spin spinning={loading}>
      <Form labelCol={{span: 5}} wrapperCol={{span: 19}}>
        <Form.Item key="name" label="流媒体名称">
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入流媒体名称'},
              {max: 200, message: '流媒体名称不超过200个字符'}
            ],
            initialValue: item?.name,
          })(<Input placeholder="请输入流媒体名称"/>)}
        </Form.Item>
        <Form.Item key="provider" label="服务商">
          {getFieldDecorator('provider', {
            rules: [{required: true, message: '请选择服务商'}],
            initialValue: item?.provider,
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
        {renderConfig()}
      </Form>
      <div
        style={{
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            setLoading(true);
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Spin>
  )
};

export default Form.create<Props>()(Save);
