import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import { service } from '@/pages/device/Instance';
import type { DeviceInstance } from '../typings';
import { useEffect, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { UploadImage } from '@/components';
import { debounce } from 'lodash';

interface Props {
  visible: boolean;
  close: (data: DeviceInstance | undefined) => void;
  reload?: () => void;
  model?: 'add' | 'edit';
  data?: Partial<DeviceInstance>;
}

const Save = (props: Props) => {
  const { visible, close, data } = props;
  const [productList, setProductList] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [visible]);

  const intl = useIntl();

  useEffect(() => {
    service.getProductList({ paging: false }).then((resp: any) => {
      if (resp.status === 200) {
        const list = resp.result.map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
        setProductList(list);
      }
    });
  }, []);

  const intlFormat = (
    id: string,
    defaultMessage: string,
    paramsID?: string,
    paramsMessage?: string,
  ) => {
    const paramsObj: Record<string, string> = {};
    if (paramsID) {
      const paramsMsg = intl.formatMessage({
        id: paramsID,
        defaultMessage: paramsMessage,
      });
      paramsObj.name = paramsMsg;
    }
    const msg = intl.formatMessage(
      {
        id,
        defaultMessage,
      },
      paramsObj,
    );
    return msg;
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (values) {
      const resp = (await service.update(values)) as any;
      if (resp.status === 200) {
        message.success('保存成功');
        if (props.reload) {
          props.reload();
        }
        props.close(values);
        form.resetFields();
      }
    }
  };

  const vailId = (_: any, value: any, callback: Function) => {
    if (props.model === 'add') {
      service.isExists(value).then((resp: any) => {
        if (resp.status === 200 && resp.result) {
          callback(
            intl.formatMessage({
              id: 'pages.form.tip.existsID',
              defaultMessage: 'ID重复',
            }),
          );
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };

  return (
    <Modal
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        close(undefined);
      }}
      width="30vw"
      title={intl.formatMessage({
        id: `pages.data.option.${props.model || 'add'}`,
        defaultMessage: '新增',
      })}
      onOk={handleSave}
    >
      <Form
        form={form}
        layout={'vertical'}
        labelAlign={'right'}
        labelCol={{
          style: { width: 100 },
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item name={'photoUrl'}>
              <UploadImage />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label={'ID'}
              name={'id'}
              tooltip={intlFormat('pages.form.tooltip.id', '若不填写，系统将自动生成唯一ID')}
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_\-]+$/,
                  message: intlFormat('pages.form.tip.id', '请输入英文或者数字或者-或者_'),
                },
                {
                  max: 64,
                  message: intlFormat('pages.form.tip.max64', '最多输入64个字符'),
                },
                {
                  validator: debounce(vailId, 300),
                },
              ]}
            >
              <Input
                disabled={props.model === 'edit'}
                placeholder={intlFormat('pages.form.tip.input', '请输入')}
              />
            </Form.Item>
            <Form.Item
              label={intlFormat('pages.table.name', '名称')}
              name={'name'}
              rules={[
                {
                  required: true,
                  message: intlFormat(
                    'pages.form.tip.input.props',
                    '请输入名称',
                    'pages.table.name',
                    '名称',
                  ),
                },
                {
                  max: 64,
                  message: intl.formatMessage({
                    id: 'pages.form.tip.max64',
                    defaultMessage: '最多输入64个字符',
                  }),
                },
              ]}
              required
            >
              <Input placeholder={intlFormat('pages.form.tip.input', '请输入')} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label={'所属产品'}
              name={'productId'}
              rules={[
                {
                  required: true,
                  message: intlFormat(
                    'pages.form.tip.select.props',
                    '请选择所属产品',
                    'pages.device.instanceDetail.deviceType',
                    '设备类型',
                  ),
                },
              ]}
              required
            >
              <Select
                showSearch
                options={productList}
                onSelect={(_: any, node: any) => {
                  form.setFieldsValue({
                    productName: node.label,
                  });
                }}
                filterOption={(input, option) => option.label.includes(input)}
              />
            </Form.Item>
            <Form.Item hidden={true} name={'productName'}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={intlFormat('pages.table.description', '说明')} name={'describe'}>
              <Input.TextArea
                placeholder={intlFormat('pages.form.tip.input', '请输入')}
                rows={4}
                style={{ width: '100%' }}
                maxLength={200}
                showCount={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default Save;
