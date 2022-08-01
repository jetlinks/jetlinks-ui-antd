import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Input, message, Modal, Spin, Select } from 'antd';
import apis from '@/services';
import { FlowCard } from '../data.d';

interface Props extends FormComponentProps {
  close: Function;
  reload: Function;
  data: Partial<FlowCard>;
  configure: any;
}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [platformConfigId, setPlatformConfigId] = useState<string>('');

  const preservation = (item: any) => {
    if (props.data.id) {
      apis.flowCard.update(props.data.id, item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    } else {
      apis.flowCard.saveData(item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('创建成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    }
  };

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      preservation(fileValue)
    })
  };

  useEffect(() => {
    if (props.data.id) {
      setPlatformConfigId(props.data.platformConfigId);
    }
  }, []);

  return (
    <Modal
      width={800}
      title={`${props.data.id ? '编辑' : '新增'}`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Spin spinning={false}>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item key="id" label="卡号">
            {getFieldDecorator('id', {
              rules: [
                { required: true, message: '请输入卡号' },
              ],
              initialValue: props.data.id,
            })(<Input placeholder="请输入卡号" />)}
          </Form.Item>
          <Form.Item key="iccId" label="ICCID">
            {getFieldDecorator('iccId', {
              rules: [
                { required: true, message: '请输入ICCID' },
              ],
              initialValue: props.data.iccId,
            })(<Input placeholder="请输入ICCID" />)}
          </Form.Item>
          <Form.Item key="platformConfigId" label="对接平台配置ID">
            {getFieldDecorator('platformConfigId', {
              rules: [
                { required: true, message: '请选择对接平台配置ID' },
              ],
              initialValue: props.data.platformConfigId,
            })
              (<Select
                placeholder="请选择对接平台配置ID"
                onChange={e => setPlatformConfigId(e)}
              >
                {props.configure?.map(i => (
                  <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item key="operatorName" label="运营商">
            {getFieldDecorator('operatorName', {
              rules: [
                { required: true, message: '请输入运营商' },
              ],
              initialValue: props.data.operatorName,
            })(<Input placeholder="请输入运营商" />)}
          </Form.Item>
          <Form.Item key="cardType" label="类型">
            {getFieldDecorator('cardType', {
              rules: [
                { required: true, message: '请选择类型' },
              ],
              initialValue: props.data.cardType?.value,
            })
              (<Select
                placeholder="请选择类型"
              >
                <Select.Option key='year' value='year'>{'年卡'}</Select.Option>
                <Select.Option key='mouth' value='mouth'>{'月卡'}</Select.Option>
                <Select.Option key='other' value='other'>{'其它'}</Select.Option>
              </Select>)}
          </Form.Item>
          <Form.Item key="batchNumber" label="批次号">
            {getFieldDecorator('batchNumber', {
              rules: [
                { required: false, message: '请输入批次号' },
              ],
              initialValue: props.data.batchNumber,
            })(<Input placeholder="请输入批次号" />)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
