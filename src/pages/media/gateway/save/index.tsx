import {Button, Col, Input, InputNumber, message, Radio, Row, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import Service from "../service";
import Form from "antd/es/form";
import {FormComponentProps} from "antd/lib/form";

interface Props extends FormComponentProps {

}

const Save: React.FC<Props> = props => {

  const {form: {getFieldDecorator}, form} = props;

  const service = new Service('media/gb28181');

  const [data, setData] = useState<any>({});
  const [productList, setProductList] = useState<any[]>([]);
  const [mediaServerList, setMediaServerList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const initValue = () => {
    service.gatewayInfo("test").subscribe(data => {
      setData(data);
    }, () => {
    }, () => setLoading(false));

    service.queryProduct({}).subscribe(data => {
      setProductList(data);
    }, () => {
    }, () => setLoading(false));

    service.mediaServer({}).subscribe((data) => {
      setMediaServerList(data);
    }, () => {
    }, () => setLoading(false))
  };

  useEffect(() => initValue(), [loading]);

  const saveData = () => {

    form.validateFields((err, fileValue) => {
      if (err) return;

      //todo 统一界面，后期有需求就开放多网关和流媒体服务

      fileValue.id = 'test';
      fileValue.mediaServerId = 'test';
      service.saveOrUpdate(fileValue).subscribe(() => {
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

  return (
    <Spin spinning={loading}>
      <Form labelCol={{span: 3}} wrapperCol={{span: 21}}>
        <Form.Item key="name" label="信令名称">
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入信令名称'},
              {max: 200, message: '信令名称不超过200个字符'}
            ],
            initialValue: data?.name,
          })(<Input placeholder="请输入信令名称"/>)}
        </Form.Item>
        <Form.Item key="productId" label="关联产品">
          {getFieldDecorator('productId', {
            rules: [{required: true, message: '请选择关联产品'}],
            initialValue: data?.productId,
          })(
            <Select placeholder="请选择关联产品">
              {(productList || []).map(item => (
                <Select.Option
                  key={JSON.stringify({productId: item.id, productName: item.name})}
                  value={item.id}
                >
                  {`${item.name}(${item.id})`}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {/*<Form.Item key="mediaServerId" label="流媒体服务">
          {getFieldDecorator('mediaServerId', {
            rules: [{required: true, message: '请选择流媒体服务'}],
            initialValue: data?.mediaServerId,
          })(
            <Select placeholder="请选择流媒体服务">
              {(mediaServerList || []).map(item => (
                <Select.Option
                  key={JSON.stringify({mediaServerId: item.id, mediaServerName: item.name})}
                  value={item.id}
                >
                  {`${item.name}(${item.id})`}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>*/}
        <Row>
          <Col span={12}>
            <Form.Item key="name" label="SIP ID" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.sipId', {
                rules: [
                  {required: true, message: '请输入信令SIP ID'}
                ],
                initialValue: data?.sipConfig?.sipId,
              })(<Input placeholder="请输入信令SIP ID"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="SIP 域" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.domain', {
                rules: [
                  {required: true, message: '请输入信令SIP 域'}
                ],
                initialValue: data?.sipConfig?.domain,
              })(<Input placeholder="请输入信令SIP 域"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="SIP Host" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.localAddress', {
                rules: [
                  {required: true, message: '请输入信令SIP Host'}
                ],
                initialValue: data?.sipConfig?.localAddress,
              })(<Input placeholder="请输入信令SIP Host"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="接入密码" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.password', {
                rules: [
                  {required: true, message: '请输入信令接入密码'}
                ],
                initialValue: data?.sipConfig?.password,
              })(<Input.Password placeholder="请输入信令接入密码"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.port', {
                rules: [
                  {required: true, message: '请输入信令端口'}
                ],
                initialValue: data?.sipConfig?.port,
              })(<InputNumber placeholder="端口" style={{width: '100%'}}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="公网端口" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.publicPort', {
                rules: [
                  {required: true, message: '请输入信令端口'}
                ],
                initialValue: data?.sipConfig?.publicPort,
              })(<InputNumber placeholder="请输入信令端口" style={{width: '100%'}}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="charset" label="字符集" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              {getFieldDecorator('sipConfig.charset', {
                rules: [
                  {required: true, message: '请选择字符集'}
                ],
                initialValue: data?.sipConfig?.charset || "GBK",
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="GBK">GB2312</Radio.Button>
                  <Radio.Button value="UTF-8">UTF-8</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {
            initialValue: data?.description,
          })(<Input.TextArea rows={4} placeholder="请输入至少五个字符"/>)}
        </Form.Item>
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
