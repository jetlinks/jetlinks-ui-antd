import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
// import { useEffect, useState } from 'react';
// import { service } from '@/pages/link/Channel/Modbus';
// import { onlyMessage } from '@/utils/util';

interface Props {
  data: any;
  close: Function;
}

const SavePoint = (props: Props) => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    const formData = await form.validateFields();
    console.log(formData);
  };

  return (
    <Modal
      title={props.data.id ? '编辑点位' : '新增点位'}
      visible
      width="40vw"
      destroyOnClose
      onOk={handleSave}
      onCancel={() => {
        props.close();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        // initialValues={{
        //     ...props.data,
        //     codecConfig: {
        //         ...props.data?.codecConfig,
        //         readIndex: props.data?.codecConfig?.readIndex || 0,
        //         scaleFactor: props.data?.codecConfig?.scaleFactor || 1,
        //         revertBytes: props.data?.codecConfig?.revertBytes || false,
        //     },
        // }}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="名称"
              name="name"
              required
              rules={[{ required: true, message: '名称必填' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="功能码"
              name="function"
              required
              rules={[{ required: true, message: '功能码必选' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value={'Coils'}>线圈寄存器</Select.Option>
                <Select.Option value={'HoldingRegisters'}>保存寄存器</Select.Option>
                <Select.Option value={'InputRegisters'}>输入寄存器</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="从站ID"
              name="unitId"
              required
              rules={[
                { required: true, message: '从站ID' },
                ({}) => ({
                  validator(_, value) {
                    if (value !== 0 || /(^[1-9]\d*$)/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入非0正整数'));
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="寄存器数量"
              name="quantity"
              rules={[
                { required: true, message: '请输入寄存器数量' },
                ({}) => ({
                  validator(_, value) {
                    if (/(^[0-9]\d*$)/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入正整数'));
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="地址"
              name="address"
              tooltip="要获取的对象地址"
              rules={[
                { required: true, message: '请输入读取长度' },
                ({}) => ({
                  validator(_, value) {
                    if (value > 1 && value < 255) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入1~255之间的数字'));
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="采集频率"
              name="interval"
              tooltip="若不填写表示不定时拉取数据"
              rules={[
                ({}) => ({
                  validator(_, value) {
                    if (value !== 0 || /(^[1-9]\d*$)/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入正整数'));
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入" addonAfter={<>ms</>} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default SavePoint;
