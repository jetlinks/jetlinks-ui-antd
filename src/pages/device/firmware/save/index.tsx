import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { AutoComplete, Button, Col, Input, message, Modal, Row, Select, Upload } from 'antd';
import { FirmwareData } from '../data';
import { UploadProps } from 'antd/lib/upload';
import { getAccessToken } from '@/utils/authority';
import apis from '@/services';
import { DeviceProduct } from '@/pages/device/product/data';
import styles from './index.less';
import SchemaForm, { createFormActions, Field } from '@formily/antd';
import { ArrayTable, Input as FInput } from '@formily/antd-components';
interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<FirmwareData>;
}

interface State {
  productList: any[];
  fileData: any;
}
const actions = createFormActions();

const Save: React.FC<Props> = props => {
  const initState: State = {
    productList: [],
    fileData: {},
  };

  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const [productList, setProductList] = useState(initState.productList);
  const [fileData, setFileData] = useState(initState.fileData);

  const submitData = () => {
    form.validateFields(async (err, fileValue) => {
      if (err) return;

      if (!fileData.url && !fileValue.url) {
        message.error('请先上传文件');
        return;
      }
      const product: Partial<DeviceProduct> =
        productList.find(i => i.id === fileValue.productId) || {};
      fileValue.url = fileData.url || fileValue.url;
      fileValue.size = fileData.size || 0;

      const properties = await actions.submit();

      fileValue.properties = properties.values?.properties;
      props.save({
        ...fileValue,
        id: props.data.id,
        productName: product.name,
      });
    });
  };

  useEffect(() => {
    if (props.data.id) {
      setFileData({
        size: props.data.size,
        url: props.data.url,
      });
    }

    // 获取下拉框数据
    apis.deviceProdcut
      .queryNoPagin({paging: false})
      .then(response => {
        setProductList(response.result);
      })
      .catch(() => {});
  }, []);

  const uploadProps: UploadProps = {
    accept: '*',
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        setFileData({
          size: info.file.size,
          url: info.file.response.result,
        });
        form.setFieldsValue({ url: info.file.response.result });
        message.success('文件上传成功');
      }
    },
  };

  const jsonValidator = async (rule, value, callback) => {
    try {
      JSON.parse(value);
    } catch (error) {
      callback('格式错误');
    }
  };

  return (
    <Modal
      title={`${props.data?.id ? '编辑' : '新建'}固件版本`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      width="60vw"
      onCancel={() => props.close()}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} key="firmware-form">
        <Form.Item key="productId" label="所属产品">
          {getFieldDecorator('productId', {
            rules: [{ required: true, message: '所属产品必填' }],
            initialValue: props.data.productId,
          })(
            <Select
              placeholder="选择所属产品"
              showSearch={true}
              allowClear={true}
              filterOption={(inputValue, option) =>
                option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              {productList.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item key="name" label="固件名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入固件名称' },
              { max: 200, message: '固件名称不超过200个字符' },
            ],
            initialValue: props.data.name,
          })(<Input placeholder="输入固件名称" />)}
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              key="version"
              label="版本号"
            >
              {getFieldDecorator('version', {
                rules: [
                  { required: true, message: '版本号必填' },
                  // { pattern: new RegExp(/^[0-9]+\.[0-9]+\.[0-9]+$/, "g"), message: '版本号格式：0.0.0' }
                ],
                initialValue: props.data.version,
              })(<Input placeholder="输入版本号" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              key="versionOrder"
              label="版本序号"
            >
              {getFieldDecorator('versionOrder', {
                rules: [{ required: true, message: '版本序号必填' },
                { pattern: new RegExp(/^[+]{0,1}(\d+)$/, "g"), message: '版本号序号只支持正整数' }
              ],
                initialValue: props.data.versionOrder,
              })(<Input placeholder="输入版本序号" />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              key="signMethod"
              label="签名方式"
            >
              {getFieldDecorator('signMethod', {
                rules: [{ required: true, message: '签名方式必填' }],
                initialValue: props.data.signMethod,
              })(
                <AutoComplete dataSource={['MD5', 'SHA256']}>
                  <Input />
                </AutoComplete>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} key="sign" label="签名">
              {getFieldDecorator('sign', {
                rules: [{ required: true, message: '签名必填' }],
                initialValue: props.data.sign,
              })(<Input placeholder="输入签名" />)}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className={styles.fileUpload} label="文件上传" key="uploadFile">
          {getFieldDecorator('url', {
            initialValue: props.data.url,
          })(
            <Input
              addonAfter={
                <Upload {...uploadProps}>
                  <Button type="primary" icon="upload">
                    上传文件
                  </Button>
                </Upload>
              }
            />,
          )}
        </Form.Item>
        <Form.Item label="其他配置">
          <SchemaForm
            components={{ ArrayTable, FInput }}
            initialValues={{
              properties: props.data?.properties,
            }}
            className={styles.convert}
            actions={actions}
          >
            <Field name="properties" type="array" x-component="ArrayTable">
              <Field type="object">
                <Field name="id" x-component="FInput" title="key" />
                <Field name="value" x-component="FInput" title="value" />
              </Field>
            </Field>
          </SchemaForm>
        </Form.Item>
        <Form.Item label="描述" key="description">
          {getFieldDecorator('description', {
            initialValue: props.data.description,
          })(<Input.TextArea rows={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
