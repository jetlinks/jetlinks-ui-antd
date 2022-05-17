import { Col, Form, Input, Modal, Row, Select, InputNumber, Radio, message } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/Channel/Opcua';
import { DataTypeList } from '@/pages/device/data';

interface Props {
  data: any;
  deviceId: string;
  opcUaId: string;
  close: Function;
}

const AddPoint = (props: Props) => {
  const [form] = Form.useForm();
  const [enableCalculate, setEnableCalculate] = useState<boolean>();
  const [property, setProperty] = useState<any>([]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    const { name } = property.find((item: any) => item.id === formData.property);
    if (props.data.id) {
      if (formData.enableCalculate) {
        service
          .editPoint(
            {
              ...formData,
              name: name,
              deviceId: props.deviceId,
              opcUaId: props.opcUaId,
              configuration: {
                initialValue: formData.initialValue,
                multiple: formData.multiple,
              },
            },
            props.data.id,
          )
          .then((res) => {
            if (res.status === 200) {
              message.success('保存成功');
              props.close();
            }
          });
      } else {
        service
          .editPoint(
            {
              ...formData,
              name: name,
              deviceId: props.deviceId,
              opcUaId: props.opcUaId,
            },
            props.data.id,
          )
          .then((res) => {
            if (res.status === 200) {
              message.success('保存成功');
              props.close();
            }
          });
      }
    } else {
      if (formData.enableCalculate) {
        service
          .addPoint({
            ...formData,
            name: name,
            deviceId: props.deviceId,
            opcUaId: props.opcUaId,
            configuration: {
              initialValue: formData.initialValue,
              multiple: formData.multiple,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              message.success('保存成功');
              props.close();
            }
          });
      } else {
        service
          .addPoint({
            ...formData,
            name: name,
            deviceId: props.deviceId,
            opcUaId: props.opcUaId,
          })
          .then((res) => {
            if (res.status === 200) {
              message.success('保存成功');
              props.close();
            }
          });
      }
    }
  };

  useEffect(() => {
    console.log(props.data);
    service.deviceDetail(props.deviceId).then((res) => {
      if (res.result.metadata) {
        const item = JSON.parse(res.result?.metadata);
        setProperty(item.properties);
      }
    });
    if (props.data.enableCalculate) {
      setEnableCalculate(true);
    }
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
          initialValue: props.data?.configuration?.initialValue,
          multiple: props.data?.configuration?.multiple,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="OPC点位ID"
              required
              name="opcPointId"
              rules={[
                { type: 'string', max: 64 },
                { required: true, message: '请输入OPC点位ID' },
              ]}
            >
              <Input placeholder="请输入OPC点位ID" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="属性"
              name="property"
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
              label="数据类型"
              name="dataType"
              required
              rules={[{ required: true, message: '数据类型必选' }]}
            >
              <Select placeholder="请选择数据类型">
                {DataTypeList.map((item) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="数据模式"
              name="dataMode"
              required
              rules={[{ required: true, message: '数据模式必选' }]}
            >
              <Select placeholder="请选择数据模式">
                <Select.Option value="pull" key={'pull'}>
                  拉取
                </Select.Option>
                <Select.Option value="sub" key={'sub'}>
                  订阅
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="采样频率"
              name="interval"
              required
              rules={[{ required: true, message: '采样频率必填' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入采样频率" min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="开启计算"
              name="enableCalculate"
              required
              rules={[{ required: true, message: '开启计算必选' }]}
            >
              <Radio.Group
                buttonStyle="solid"
                onChange={(e) => {
                  console.log(e.target.value);
                  setEnableCalculate(e.target.value);
                }}
              >
                <Radio.Button value={true}>是</Radio.Button>
                <Radio.Button value={false}>否</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {enableCalculate && (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item label="初始值" name="initialValue" required>
                <Input placeholder="请输入初始值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="倍数" name="multiple" required>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
        )}
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
