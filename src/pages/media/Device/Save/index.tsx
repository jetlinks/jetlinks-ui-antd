import {useCallback, useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Modal, Radio, Row, Select, Tooltip} from 'antd';
import {useIntl} from 'umi';
import {RadioCard, UploadImage} from '@/components';
import {PlusOutlined} from '@ant-design/icons';
import {service} from '../index';
import SaveProductModal from './SaveProduct';
import type {DeviceItem} from '../typings';
import {getButtonPermission} from '@/utils/menu';

interface SaveProps {
  visible: boolean;
  close: () => void;
  reload: () => void;
  data?: DeviceItem;
  model: 'add' | 'edit';
}

const DefaultAccessType = 'gb28181-2016';

export default (props: SaveProps) => {
  const { visible, close, data } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [accessType, setAccessType] = useState(DefaultAccessType);
  const [productList, setProductList] = useState<any[]>([]);
  const [oldPassword, setOldPassword] = useState('');

  const getProductList = async (productParams: any) => {
    const resp = await service.queryProductList(productParams);
    if (resp.status === 200) {
      setProductList(resp.result);
    }
  };

  const queryProduct = async (value: string) => {
    getProductList({
      terms: [
        { column: 'accessProvider', value: value },
        { column: 'state', value: 1 },
      ],
    });
  };

  useEffect(() => {
    if (visible) {
      setOldPassword('');
      if (props.model === 'edit') {
        form.setFieldsValue(data);
        const _accessType = data?.provider || DefaultAccessType;
        setAccessType(_accessType);

        queryProduct(_accessType);
      } else {
        form.setFieldsValue({
          provider: DefaultAccessType,
        });
        queryProduct(DefaultAccessType);
        setAccessType(DefaultAccessType);
      }
    }
  }, [visible]);

  const handleSave = useCallback(async () => {
    const formData = await form.validateFields();
    if (formData) {
      const { provider, ...extraFormData } = formData;
      if (formData.password === oldPassword) {
        delete extraFormData.password;
      }
      setLoading(true);
      const resp =
        provider === DefaultAccessType
          ? await service.saveGB(extraFormData)
          : await service.saveFixed(extraFormData);
      setLoading(false);
      if (resp.status === 200) {
        if (props.reload) {
          props.reload();
        }
        form.resetFields();
        close();
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
    }
  }, [props.model, oldPassword]);

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

  return (
    <>
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
          labelCol={{
            style: { width: 100 },
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name={'provider'}
                label={'接入方式'}
                required
                rules={[{ required: true, message: '请选择接入方式' }]}
              >
                <RadioCard
                  model={'singular'}
                  itemStyle={{ width: '50%' }}
                  onSelect={(key) => {
                    setAccessType(key);
                    queryProduct(key);
                  }}
                  disabled={props.model === 'edit'}
                  options={[
                    {
                      label: 'GB/T28181',
                      value: DefaultAccessType,
                    },
                    {
                      label: '固定地址',
                      value: 'fixed-media',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
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
                required
                rules={[
                  { required: true, message: '请输入ID' },
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
                ]}
              >
                <Input placeholder={'请输入ID'} disabled={props.model === 'edit'} />
              </Form.Item>
              <Form.Item
                label={'设备名称'}
                name={'name'}
                required
                rules={[
                  { required: true, message: '请输入名称' },
                  { max: 64, message: '最多可输入64个字符' },
                ]}
              >
                <Input placeholder={'请输入设备名称'} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label={'所属产品'}
                required
                rules={[{ required: true, message: '请选择所属产品' }]}
              >
                <Form.Item name={'productId'} noStyle>
                  <Select
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                    }}
                    disabled={props.model === 'edit'}
                    options={productList}
                    placeholder={'请选择所属产品'}
                    style={{ width: props.model === 'edit' ? '100%' : 'calc(100% - 36px)' }}
                    onSelect={(_: any, node: any) => {
                      const pwd = node.configuration ? node.configuration.access_pwd : '';
                      form.setFieldsValue({
                        password: pwd,
                      });
                      setOldPassword(pwd);
                    }}
                  />
                </Form.Item>
                {props.model !== 'edit' && (
                  <Form.Item noStyle>
                    {getButtonPermission('device/Product', 'add') ? (
                      <Tooltip title={'暂无权限，请联系管理员'}>
                        <Button type={'link'} style={{ padding: '4px 10px' }} disabled>
                          <PlusOutlined />
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        type={'link'}
                        style={{ padding: '4px 10px' }}
                        onClick={() => {
                          setProductVisible(true);
                        }}
                      >
                        <PlusOutlined />
                      </Button>
                    )}
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
            {accessType === DefaultAccessType && (
              <Col span={24}>
                <Form.Item
                  label={'接入密码'}
                  name={'password'}
                  required
                  rules={[
                    { required: true, message: '请输入接入密码' },
                    { max: 64, message: '最大可输入64位' },
                  ]}
                >
                  <Input.Password placeholder={'请输入接入密码'} />
                </Form.Item>
              </Col>
            )}
            {props.model === 'edit' && (
              <>
                <Col span={24}>
                  <Form.Item
                    label={'流传输模式'}
                    name={'streamMode'}
                    required
                    rules={[{ required: true, message: '请选择流传输模式' }]}
                  >
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      options={[
                        { label: 'UDP', value: 'UDP' },
                        { label: 'TCP', value: 'TCP_PASSIVE' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'设备厂商'}
                    name={'manufacturer'}
                    rules={[{ max: 64, message: '最多可输入64个字符' }]}
                  >
                    <Input placeholder={'请输入设备厂商'} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'设备型号'}
                    name={'model'}
                    rules={[{ max: 64, message: '最多可输入64个字符' }]}
                  >
                    <Input placeholder={'请输入设备型号'} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={'固件版本'}
                    name={'firmware'}
                    rules={[{ max: 64, message: '最多可输入64个字符' }]}
                  >
                    <Input placeholder={'请输入固件版本'} />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={24}>
              <Form.Item label={'说明'} name={'description'}>
                <Input.TextArea
                  placeholder={intlFormat(
                    'pages.form.tip.input.props',
                    '请输入',
                    'pages.table.describe',
                    '说明',
                  )}
                  rows={4}
                  style={{width: '100%'}}
                  maxLength={200}
                  showCount={true}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={'id'} hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <SaveProductModal
        visible={productVisible}
        type={accessType}
        close={() => {
          setProductVisible(false);
        }}
        reload={(productId: string, name: string) => {
          form.setFieldsValue({ productId });
          productList.push({
            id: productId,
            name,
          });
          setProductList([...productList]);
        }}
      />
    </>
  );
};
