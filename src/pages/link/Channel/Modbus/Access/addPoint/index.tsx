import { Col, Form, Input, InputNumber, message, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/Channel/Modbus';

interface Props {
  data: any;
  deviceId: string;
  opcUaId: string;
  close: Function;
}

const AddPoint = (props: Props) => {
  const { opcUaId, deviceId, data } = props;
  const [form] = Form.useForm();
  const [property, setProperty] = useState<any>([]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    service
      .saveMetadataConfig(opcUaId, deviceId, {
        ...data,
        ...formData,
        metadataType: 'property',
        codec: 'number',
      })
      .then((res: any) => {
        if (res.status === 200) {
          message.success('操作成功！');
          props.close();
        }
      });
  };

  useEffect(() => {
    console.log(props.data);
    service.deviceDetail(props.deviceId).then((res: any) => {
      if (res.result.metadata) {
        const item = JSON.parse(res.result?.metadata);
        setProperty(item.properties);
      }
    });
  }, []);
  return (
    <Modal
      title={props.data.id ? '编辑' : '新增'}
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
        initialValues={{
          ...props.data,
          codecConfig: {
            readIndex: props.data?.codecConfig?.readIndex || 0,
            scaleFactor: props.data?.codecConfig?.scaleFactor || 1,
          },
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="属性"
              name="metadataId"
              required
              rules={[{ required: true, message: '属性必选' }]}
            >
              <Select placeholder="请选择属性">
                {property.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
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
          <Col span={12}>
            <Form.Item
              label="读取起始位置"
              name={['codecConfig', 'readIndex']}
              required
              rules={[
                { required: true, message: '请输入读取起始位置' },
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
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="读取长度"
              name={['codecConfig', 'readLength']}
              required
              rules={[
                { required: true, message: '请输入读取长度' },
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
          <Col span={12}>
            <Form.Item
              label="变换器寄存器高低字节"
              name={['codecConfig', 'revertBytes']}
              required
              rules={[{ required: true, message: '变换器寄存器高低字节必填' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value={false}>否</Select.Option>
                <Select.Option value={true}>是</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="缩放因子"
              name={['codecConfig', 'scaleFactor']}
              required
              tooltip="基于原始数据按比例进行数据缩放。默认比例为1,不能为0"
              rules={[
                { required: true, message: '请输入缩放因子' },
                ({}) => ({
                  validator(_, value) {
                    if (value !== 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入正整数'));
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="数据格式转换"
              name={['codecConfig', 'unsigned']}
              required
              rules={[{ required: true, message: '数据格式转换必填' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value={false}>无符号数字</Select.Option>
                <Select.Option value={true}>有符号数字</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="读取数据周期"
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
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item label="说明" name="description">
              <Input.TextArea maxLength={200} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddPoint;
