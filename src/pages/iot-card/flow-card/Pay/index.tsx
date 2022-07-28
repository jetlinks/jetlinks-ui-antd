import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Input, message, Modal, Spin, Select } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  reload: Function;
  data: Partial<any>;
  configure: any;
}

interface State {
  type: string;
}

const Pay: React.FC<Props> = props => {
  const initState: State = {
    type: '',
  }

  const [type, setType] = useState(initState.type)

  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const preservation = (item: any) => {
    apis.flowCard._recharge(item)
      .then((response: any) => {
        if (response.status === 200) {
          if (response.result === '失败') {
            message.error('缴费失败')
          } else {
            window.open(response.result)
          }
          props.close();
          props.reload()
        }
      })
      .catch(() => { });
  };

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      preservation(fileValue)
    })
  };

  useEffect(() => { }, []);

  return (
    <Modal
      width={800}
      title={'充值缴费（暂不支持ctwingCmp）'}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Spin spinning={false}>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          <Form.Item key="configId" label="平台配置ID">
            {getFieldDecorator('configId', {
              rules: [
                { required: false, message: '请选择平台配置ID' },
              ],
              initialValue: props.data.configId,
            })(<Select
              placeholder="请选择平台配置ID"
            >
              {props.configure?.map(i => (
                <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
              ))}
            </Select>)}
          </Form.Item>
          <Form.Item key="rechargeType" label="充值标识类型">
            {getFieldDecorator('rechargeType', {
              rules: [
                { required: false, message: '请选择充值标识类型' },
              ],
              initialValue: props.data.rechargeType,
            })(<Select
              placeholder="请选择充值标识类型"
              onChange={
                (value) => {
                  setType(value)
                }}
            >
              <Select.Option key='msisdn' value='msisdn'>{'单卡充值'}</Select.Option>
              <Select.Option key='accountId' value='accountId'>{'账户充值'}</Select.Option>
            </Select>)}
          </Form.Item>
          <Form.Item key="rechargeId" label={type === 'accountId' ? '账户Id' : '物联卡卡号'}>
            {getFieldDecorator('rechargeId', {
              rules: [
                { required: false, message: '请输入' },
              ],
              initialValue: props.data.rechargeId,
            })(<Input placeholder={type === 'accountId' ? '请输入账户Id' : '请输入物联卡卡号'} disabled={!!props.data.rechargeId} />)}
          </Form.Item>
          <Form.Item key="chargeMoney" label="充值金额">
            {getFieldDecorator('chargeMoney', {
              rules: [
                { required: false, message: '请输入充值金额' },
              ],
              initialValue: props.data.chargeMoney,
            })(<Input placeholder="请输入充值金额" disabled={!!props.data.chargeMoney} />)}
          </Form.Item>
          <Form.Item key="paymentType" label="支付方式">
            {getFieldDecorator('paymentType', {
              rules: [
                { required: false, message: '请选择支付方式' },
              ],
              initialValue: props.data.paymentType,
            })
              (<Select
                placeholder="请选择支付方式"
              >
                <Select.Option key='ALIPAY_WAP' value='ALIPAY_WAP'>{'支付宝手机网站支付'}</Select.Option>
                <Select.Option key='ALIPAY_WEB' value='ALIPAY_WEB'>{'支付宝网页即时到账支付'}</Select.Option>
                <Select.Option key='WEIXIN_JSAPI' value='WEIXIN_JSAPI'>{'微信公众号支付'}</Select.Option>
                <Select.Option key='WEIXIN_NATIVE' value='WEIXIN_NATIVE'>{'微信扫码支付'}</Select.Option>
              </Select>)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Pay);
