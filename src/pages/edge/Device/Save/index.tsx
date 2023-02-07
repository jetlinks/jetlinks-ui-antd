import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { PermissionButton, UploadImage } from '@/components';
import { debounce } from 'lodash';
import encodeQuery from '@/utils/encodeQuery';
import { onlyMessage } from '@/utils/util';
import { PlusOutlined } from '@ant-design/icons';
import SaveProductModal from '@/pages/media/Device/Save/SaveProduct';
import { DeviceInstance } from '@/pages/device/Instance/typings';

interface Props {
  close: (data: DeviceInstance | undefined) => void;
  reload?: () => void;
  model?: 'add' | 'edit';
  data?: Partial<DeviceInstance>;
}

const defaultImage = '/images/device-type-3-big.png';

const Save = (props: Props) => {
  const { close, data } = props;
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const { permission } = PermissionButton.usePermission('device/Product');

  useEffect(() => {
    if (data && Object.keys(data).length) {
      form.setFieldsValue({ ...data });
    } else {
      form.setFieldsValue({
        photoUrl: defaultImage,
      });
    }
  }, [data]);

  const intl = useIntl();

  useEffect(() => {
    service
      .getProductList(
        encodeQuery({
          sorts: {
            createTime: 'desc',
          },
          terms: {
            state: 1,
            accessProvider: 'official-edge-gateway',
          },
        }),
      )
      .then((resp: any) => {
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
    return intl.formatMessage(
      {
        id,
        defaultMessage,
      },
      paramsObj,
    );
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (values) {
      if (values.id === '') {
        delete values.id;
      }
      setLoading(true);
      const resp = (await service.update(values)) as any;
      setLoading(false);
      if (resp.status === 200) {
        onlyMessage('保存成功');
        if (props.reload) {
          props.reload();
        }
        props.close(values);
        form.resetFields();
      }
    }
  };

  const vailId = (_: any, value: any, callback: Function) => {
    if (props.model === 'add' && value) {
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
      open
      onCancel={() => {
        form.resetFields();
        close(undefined);
      }}
      width="580px"
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
                placeholder={`${intlFormat('pages.form.tip.input', '请输入')}ID`}
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
              <Input
                placeholder={
                  intlFormat('pages.form.tip.input', '请输入') +
                  intlFormat('pages.table.name', '名称')
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item
              label={'所属产品'}
              name={'productId'}
              rules={[
                {
                  required: true,
                  message: '请选择所属产品',
                },
              ]}
              // tooltip={'只能选择“正常”状态的产品'}
              required
            >
              <Select
                showSearch
                allowClear
                options={productList}
                disabled={props.model === 'edit'}
                onSelect={(_: any, node: any) => {
                  form.setFieldsValue({
                    productName: node.label,
                  });
                }}
                placeholder={'请选择所属产品'}
                filterOption={(input, option) => option.label.includes(input)}
              />
            </Form.Item>
            <Form.Item hidden={true} name={'productName'}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={2} style={{ margin: '35px 0 0 0' }}>
            <PermissionButton
              isPermission={permission.add}
              type="link"
              disabled={!!data?.id}
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined />
            </PermissionButton>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={intlFormat('pages.table.description', '说明')} name={'description'}>
              <Input.TextArea
                placeholder={
                  intlFormat('pages.form.tip.input', '请输入') +
                  intlFormat('pages.table.description', '说明')
                }
                rows={4}
                style={{ width: '100%' }}
                maxLength={200}
                showCount={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SaveProductModal
        visible={visible}
        type={'official-edge-gateway'}
        close={() => {
          setVisible(false);
        }}
        deviceType={'gateway'}
        reload={(productId: string, result: any) => {
          console.log('------', productId, result.name);

          productList.push({
            value: productId,
            label: result.name,
          });
          setProductList([...productList]);
          form.setFieldsValue({ productId: productId });
        }}
      />
    </Modal>
  );
};
export default Save;
