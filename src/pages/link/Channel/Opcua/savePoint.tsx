import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/Channel/Opcua';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: any;
  close: Function;
  opcId: string;
}

const SavePoint = (props: Props) => {
  const [form] = Form.useForm();
  const [dataMode, setDataMode] = useState<any>('');

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (props.data.id) {
      service
        .editPoint(props.data.id, {
          opcUaId: props.opcId,
          ...formData,
        })
        .then((res) => {
          if (res.status === 200) {
            onlyMessage('保存成功');
            props.close();
          }
        });
    } else {
      service
        .addPoint({
          opcUaId: props.opcId,
          ...formData,
        })
        .then((res) => {
          if (res.status === 200) {
            onlyMessage('保存成功');
            props.close();
          }
        });
    }
  };

  useEffect(() => {
    console.log(props.data);
    if (props.data.id) {
      setDataMode(props.data.dataMode?.value);
    }
  }, []);

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
        initialValues={{
          ...props.data,
        }}
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
          <Col span={24}>
            <Form.Item
              label="点位ID"
              name="opcPointId"
              required
              rules={[
                { required: true, message: '点位ID必填' },
                // ({}) => ({
                //   validator(_, value) {
                //     const item = value.substring(0, 2);
                //     if (item === 'i=' || item === 's=' || item === 'g=' || item === 'b=') {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject(new Error('前两个字符必须为i=、s=、g=、b=中的一个'));
                //   },
                // }),
              ]}
            >
              <Input placeholder="请输入点位ID" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              label="数据类型"
              name="type"
              required
              rules={[{ required: true, message: '数据类型必选' }]}
            >
              <Select
                placeholder="请选择数据模式"
                onChange={(value) => {
                  setDataMode(value);
                  form.setFieldsValue({
                    interval: '',
                  });
                }}
              >
                <Select.Option value="Boolean" key={'Boolean'}>
                  Boolean
                </Select.Option>
                <Select.Option value="Byte" key={'Byte'}>
                  Byte
                </Select.Option>
                <Select.Option value="Short" key={'Short'}>
                  Short
                </Select.Option>
                <Select.Option value="Integer" key={'Integer'}>
                  Boolean
                </Select.Option>
                <Select.Option value="Long" key={'Long'}>
                  Long
                </Select.Option>
                <Select.Option value="LLong" key={'LLong'}>
                  LLong
                </Select.Option>
                <Select.Option value="Double" key={'Double'}>
                  Double
                </Select.Option>
                <Select.Option value="String" key={'String'}>
                  String
                </Select.Option>
                <Select.Option value="DateTime" key={'DateTime'}>
                  DateTime
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="数据模式"
              name="dataMode"
              tooltip={
                <>
                  <div>订阅:订阅OPC UA点位数据发生变化后的值</div>
                  <div>拉取:拉取OPC UA点位数据值</div>
                  <div>拉取变更值:拉取OPC UA点位数据值,并丢弃处理未发生变化的数据值</div>
                  <div>
                    被动读取:不会定时读取OPC UA点位数据值,仅由平台发起读取点位数据命令时返回数据
                  </div>
                </>
              }
              required
              rules={[{ required: true, message: '数据模式必选' }]}
            >
              <Select
                placeholder="请选择数据模式"
                onChange={(value) => {
                  setDataMode(value);
                  form.setFieldsValue({
                    interval: '',
                  });
                }}
              >
                <Select.Option value="sub" key={'sub'}>
                  订阅
                </Select.Option>
                <Select.Option value="pull" key={'pull'}>
                  拉取
                </Select.Option>
                <Select.Option value="pullChanged" key={'pullChanged'}>
                  拉取变更值
                </Select.Option>
                <Select.Option value="active" key={'active'}>
                  被动读取
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {dataMode !== 'active' && (
            <Col span={12}>
              {dataMode === 'sub' && (
                <Form.Item
                  label="采集频率"
                  name="interval"
                  tooltip="OPC UA服务器采样点位数据发生变化的频率"
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
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入"
                    addonAfter={<>ms</>}
                  />
                </Form.Item>
              )}
              {(dataMode === 'pullChanged' || dataMode === 'pull') && (
                <Form.Item
                  label="拉取频率"
                  name="interval"
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
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入"
                    addonAfter={<>ms</>}
                  />
                </Form.Item>
              )}
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};
export default SavePoint;
