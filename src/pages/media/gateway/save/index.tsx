import {Button, Col, Input, InputNumber, message, Radio, Row, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import Service from "../service";
import Form from "antd/es/form";
import {FormComponentProps} from "antd/lib/form";

interface Props extends FormComponentProps {
  loading: boolean
}

interface State {
  loading: boolean;
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    loading: props.loading,
  };

  const {form: {getFieldDecorator}, form} = props;

  const service = new Service('media/gateway');
  const id = 'gb28181_gateway';

  const [data, setData] = useState<any>({});
  const [productList, setProductList] = useState<any[]>([]);
  // const [mediaServerList, setMediaServerList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(initState.loading);

  const initValue = () => {
    service.gatewayInfo(id).subscribe(data => {
      setData(data);
    }, () => {
    }, () => setLoading(false));

    // service.mediaServer({}).subscribe((data) => {
    //   setMediaServerList(data);
    // }, () => {
    // }, () => setLoading(false));
  };

  useEffect(() => {

    service.queryProduct({}).subscribe(data => {
      setProductList(data);
    }, () => {
    }, () => setLoading(false));

    initValue();
  }, [props.loading]);

  const saveData = () => {

    form.validateFields((err, fileValue) => {
      if (err) return;

      //todo 统一界面，后期有需求就开放多网关和流媒体服务

      fileValue.id = id;
      fileValue.mediaServerId = 'gb28181_MediaServer';
      fileValue.provider = 'gb28181-2016';

      service.saveGateway(fileValue).subscribe(() => {
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

  const _enabledOr_disabled = (status: string) => {
    status === "disabled" ? (
      service._enabled(id).subscribe(() => {
          message.success("启动成功");
          initValue();
        },
        () => {
          message.error("启动失败");
        },
        () => setLoading(false))
    ) : (
      service._disabled(id).subscribe(() => {
          message.success("停止成功");
          initValue();
        },
        () => {
          message.error("停止失败");
        },
        () => setLoading(false))
    );
  };

  return (
    <Spin spinning={loading}>
      <Form labelCol={{span: 5}} wrapperCol={{span: 19}}>
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
            <Select placeholder="请选择关联产品" showSearch>
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
            <Form.Item key="sipId" label="SIP ID" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.sipId', {
                rules: [
                  {required: true, message: '请输入信令SIP ID'}
                ],
                initialValue: data?.configuration?.sipId,
              })(<Input placeholder="请输入信令SIP ID"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="domain" label="SIP 域" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.domain', {
                rules: [
                  {required: true, message: '请输入信令SIP 域'}
                ],
                initialValue: data?.configuration?.domain,
              })(<Input placeholder="请输入信令SIP 域"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="localAddress" label="SIP Host" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.localAddress', {
                rules: [
                  {required: true, message: '请输入信令SIP Host'}
                ],
                initialValue: data?.configuration?.localAddress,
              })(<Input placeholder="请输入信令SIP Host"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="publicAddress" label="公网 Host" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.publicAddress', {
                rules: [
                  {required: true, message: '请输入信令公网 Host'}
                ],
                initialValue: data?.configuration?.publicAddress,
              })(<Input placeholder="请输入信令公网 Host"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="password" label="接入密码" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.password', {
                rules: [
                  {required: true, message: '请输入信令接入密码'}
                ],
                initialValue: data?.configuration?.password,
              })(<Input.Password placeholder="请输入信令接入密码"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="port" label="端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.port', {
                rules: [
                  {required: true, message: '请输入信令端口'}
                ],
                initialValue: data?.configuration?.port,
              })(<InputNumber placeholder="端口" style={{width: '100%'}}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="publicPort" label="公网端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.publicPort', {
                rules: [
                  {required: true, message: '请输入信令端口'}
                ],
                initialValue: data?.configuration?.publicPort,
              })(<InputNumber placeholder="请输入信令端口" style={{width: '100%'}}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="charset" label="字符集" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('configuration.charset', {
                rules: [
                  {required: true, message: '请选择字符集'}
                ],
                initialValue: data?.configuration?.charset || "gb2312",
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="gb2312">GB2312</Radio.Button>
                  <Radio.Button value="utf-8">UTF-8</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          {/*<Col span={12}>
            <Form.Item key="status" label="状态" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('status', {
                rules: [
                  {required: true, message: '请信令服务状态'}
                ],
                initialValue: data?.status?.value ? data.status.value : 'enabled',
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="enabled">启用</Radio.Button>
                  <Radio.Button value="disabled">禁用</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>*/}
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
        {data.status ? (data.status?.value === 'disabled' ? (
          <Button
            onClick={() => {
              setLoading(true);
              _enabledOr_disabled(data.status?.value);
            }}
            style={{marginRight: 8}}
          >
            启用
          </Button>
        ) : (
          <Button
            onClick={() => {
              setLoading(true);
              _enabledOr_disabled(data.status?.value);
            }}
            style={{marginRight: 8}}
            type="danger"
          >
            禁用
          </Button>
        )) : ""}
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
