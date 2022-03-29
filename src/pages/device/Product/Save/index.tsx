import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Product';
import type { ProductItem } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { RadioCard, UploadImage } from '@/components';
import { Col, Form, Input, message, Modal, Row, TreeSelect } from 'antd';
import { useRequest } from 'umi';
import { debounce } from 'lodash';

interface Props {
  visible: boolean;
  close: () => void;
  reload: () => void;
  data?: ProductItem;
  model: 'add' | 'edit';
}

const Save = (props: Props) => {
  const { visible, close, data } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: classOptions, run: classRequest } = useRequest(service.category, {
    manual: true,
    formatResult: (response) => {
      return response.result;
    },
  });

  const handleData = () => {
    // 特殊处理deviceType字段
    if (data) {
      if (typeof data.deviceType !== 'string') {
        data.deviceTypeId = data.deviceType?.value;
      }
    }
    return data;
  };

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

    return intl.formatMessage(
      {
        id,
        defaultMessage,
      },
      paramsObj,
    );
  };

  useEffect(() => {
    if (visible) {
      // 获取产品分类
      classRequest();
      form.setFieldsValue(handleData());
    }
  }, [visible]);

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const { deviceTypeId, ...extraFormData } = formData;
      extraFormData.deviceType = formData.deviceTypeId;
      setLoading(true);
      const res = await service.update(extraFormData);
      setLoading(false);
      if (res.status === 200) {
        message.success('保存成功');
        if (props.reload) {
          props.reload();
        }
        props.close();
        form.resetFields();
      }
    }
  };

  const vailId = (_: any, value: any, callback: Function) => {
    if (props.model === 'add' && value) {
      service.existsID(value).then((res) => {
        if (res.status === 200 && res.result) {
          callback(
            intl.formatMessage({
              id: 'pages.form.tip.existsID',
              defaultMessage: 'ID重复',
            }),
          );
        }
        callback();
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
        close();
      }}
      width={610}
      title={intl.formatMessage({
        id: `pages.data.option.${props.model || 'add'}`,
        defaultMessage: '新增',
      })}
      confirmLoading={loading}
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
              tooltip={intl.formatMessage({
                id: 'pages.form.tooltip.id',
                defaultMessage: '若不填写，系统将自动生成唯一ID',
              })}
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_\-]+$/,
                  message: intl.formatMessage({
                    id: 'pages.form.tip.id',
                    defaultMessage: '请输入英文或者数字或者-或者_',
                  }),
                },
                {
                  max: 64,
                  message: intl.formatMessage({
                    id: 'pages.form.tip.max64',
                    defaultMessage: '最多输入64个字符',
                  }),
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
            <Form.Item label={'分类'} name={'classifiedId'}>
              <TreeSelect
                showSearch
                onSelect={(_: any, node: any) => {
                  form.setFieldsValue({
                    classifiedName: node.name,
                  });
                }}
                filterTreeNode={(input, treeNode) => treeNode.name.includes(input)}
                placeholder={intlFormat('pages.form.tip.select', '请选择')}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                treeData={classOptions}
              />
            </Form.Item>
            <Form.Item hidden={true} name={'classifiedName'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={intlFormat('pages.device.instanceDetail.deviceType', '设备类型')}
              name={'deviceTypeId'}
              rules={[
                {
                  required: true,
                  message: intlFormat(
                    'pages.form.tip.select.props',
                    '请选择设备类型',
                    'pages.device.instanceDetail.deviceType',
                    '设备类型',
                  ),
                },
              ]}
              required
            >
              <RadioCard
                model={'singular'}
                options={[
                  {
                    label: intlFormat('pages.device.type.device', '直连设备'),
                    value: 'device',
                    imgUrl: require('/public/images/device-type-1.png'),
                  },
                  {
                    label: intlFormat('pages.device.type.childrenDevice', '网关子设备'),
                    value: 'childrenDevice',
                    imgUrl: require('/public/images/device-type-2.png'),
                  },
                  {
                    label: intlFormat('pages.device.type.gateway', '网关设备'),
                    value: 'gateway',
                    imgUrl: require('/public/images/device-type-3.png'),
                  },
                ]}
              />
            </Form.Item>
          </Col>
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
