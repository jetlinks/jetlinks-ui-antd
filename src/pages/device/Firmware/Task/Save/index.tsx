import { Col, Form, Input, InputNumber, message, Modal, Radio, Row, Select } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import FSelectDevices from '@/components/FSelectDevices';
import { useEffect, useRef, useState } from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { service } from '@/pages/device/Firmware';
import { onlyMessage } from '@/utils/util';

interface Props {
  ids: { id: string; productId: string };
  data?: FirmwareItem;
  close: () => void;
  save: () => void;
}

const Save = (props: Props) => {
  const { data, close, ids } = props;
  const [mode, setMode] = useState<'push' | 'pull' | undefined>(undefined);
  const [releaseType, setReleaseType] = useState<'all' | 'part' | undefined>(undefined);

  const [form] = Form.useForm();

  const devices = useRef<DeviceInstance[]>([]);

  useEffect(() => {
    // console.log(data);
    if (data && data.id) {
      setMode(data.mode.value);
    }
    if (data?.deviceId) {
      setReleaseType('part');
    } else {
      setReleaseType('all');
    }
    service.queryDevice().then((resp) => {
      if (resp.status === 200) {
        devices.current = resp.result;
      }
    });
  }, []);

  const save = async () => {
    const values = await form.validateFields();
    console.log(values);
    if (values?.releaseType !== 'all') {
      values.deviceId = (values?.deviceId || []).map((item: any) => item.id);
    } else {
      values.deviceId = undefined;
    }
    const resp = await service.saveTask({
      ...values,
      firmwareId: ids?.id,
      productId: ids?.productId,
    });
    if (resp.status === 200) {
      onlyMessage('保存成功！');
      props.save();
      form.resetFields();
      setMode(undefined);
      setReleaseType(undefined);
    } else {
      message.error('保存失败！');
    }
  };

  return (
    <Modal
      maskClosable={false}
      width="50vw"
      title={data?.id ? '查看任务' : '新增任务'}
      onCancel={() => {
        form.resetFields();
        close();
        setMode(undefined);
        setReleaseType(undefined);
      }}
      onOk={() => {
        if (data?.id) {
          close();
        } else {
          save();
        }
      }}
      visible
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{
          ...data,
          releaseType: data?.deviceId ? 'part' : 'all',
          deviceId: data?.deviceId?.map((item: any) => ({ id: item, name: item })),
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="任务名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入任务名称',
                },
                {
                  max: 64,
                  message: '最多可输入64个字符',
                },
              ]}
            >
              <Input placeholder="请输入任务名称" disabled={!!data?.id} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="推送方式"
              name="mode"
              rules={[
                {
                  required: true,
                  message: '请选择推送方式',
                },
              ]}
            >
              <Select
                placeholder="请选择推送方式"
                disabled={!!data?.id}
                onChange={(value) => {
                  setMode(value);
                }}
              >
                <Select.Option value="push">平台推送</Select.Option>
                <Select.Option value="pull">设备拉取</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {mode === 'push' && (
            <>
              <Col span={12}>
                <Form.Item
                  label="响应超时时间"
                  name="responseTimeoutSeconds"
                  rules={[
                    {
                      required: true,
                      message: '请输入响应超时时间',
                    },
                    {
                      type: 'number',
                      max: 99999,
                      min: 1,
                      message: '请输入1~99999之间的数字',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入响应超时时间(秒)"
                    disabled={!!data?.id}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="升级超时时间"
                  name="timeoutSeconds"
                  rules={[
                    {
                      required: true,
                      message: '请输入升级超时时间',
                    },
                    {
                      type: 'number',
                      max: 99999,
                      min: 1,
                      message: '请输入1~99999之间的数字',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请请输入升级超时时间(秒)"
                    disabled={!!data?.id}
                  />
                </Form.Item>
              </Col>
            </>
          )}
          {mode === 'pull' && (
            <Col span={24}>
              <Form.Item
                label="升级超时时间"
                name="timeoutSeconds"
                rules={[
                  {
                    required: true,
                    message: '请输入升级超时时间',
                  },
                  {
                    type: 'number',
                    max: 99999,
                    min: 1,
                    message: '请输入1~99999之间的数字',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请请输入升级超时时间(秒)"
                  disabled={!!data?.id}
                />
              </Form.Item>
            </Col>
          )}
          {!!mode && (
            <>
              <Col span={12}>
                <Form.Item
                  label="升级设备"
                  name="releaseType"
                  rules={[
                    {
                      required: true,
                      message: '请选择升级设备',
                    },
                  ]}
                >
                  <Radio.Group
                    disabled={!!data?.id}
                    onChange={(e) => {
                      setReleaseType(e.target.value);
                    }}
                  >
                    <Radio value="all"> 所有设备 </Radio>
                    <Radio value="part"> 选择设备 </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {releaseType === 'part' && (
                <Col span={12}>
                  <Form.Item
                    label="选择设备"
                    name="deviceId"
                    rules={[
                      {
                        required: true,
                        message: '请选择设备',
                      },
                    ]}
                  >
                    <FSelectDevices productId={ids?.productId || ''} disabled={!!data?.id} />
                  </Form.Item>
                </Col>
              )}
            </>
          )}
          <Col span={24}>
            <Form.Item label="说明" name="description">
              <Input.TextArea
                rows={3}
                maxLength={200}
                showCount={true}
                placeholder="请输入说明"
                disabled={!!data?.id}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default Save;
