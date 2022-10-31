import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Product';
import type { ProductItem } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import { RadioCard, UploadImage } from '@/components';
import { Button, Col, Form, Input, Modal, Row, TreeSelect } from 'antd';
import { useHistory, useRequest } from 'umi';
import { debounce } from 'lodash';
import { onlyMessage } from '@/utils/util';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';

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
  const history = useHistory<Record<string, string>>();
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

  const messageModel = (id: string) => {
    return Modal.success({
      title: <div style={{ fontWeight: 600 }}>产品创建成功</div>,
      width: 600,
      okText: '关闭',
      content: (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <div>产品ID: {id}</div>
            <Button
              type="link"
              onClick={() => {
                history.push(`${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], id)}`);
                Modal.destroyAll();
              }}
            >
              查看详情
            </Button>
          </div>
          <div>接下来推荐操作:</div>
          <div style={{ fontWeight: 600 }}> 1、配置产品接入方式</div>
          <div style={{ color: '#757575' }}>
            点击具体产品的查看按钮，进入“设备接入”tab页，并参照设备铭牌说明选择匹配的接入方式
          </div>
          <div style={{ fontWeight: 600 }}>2、添加测试设备</div>
          <div style={{ color: '#757575' }}>
            进入设备列表，添加单个设备，用于验证产品模型是否配置正确
          </div>
          <div style={{ fontWeight: 600 }}> 3、功能调试</div>
          <div style={{ color: '#757575' }}>
            点击查看具体设备，进入“设备诊断”对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确
          </div>
          <div style={{ fontWeight: 600 }}> 4、批量添加设备</div>
          <div style={{ color: '#757575' }}>
            进入设备列表页面，点击批量导入设备，批量添加同一产品下的设备
          </div>
        </>
      ),
    });
  };

  const handleSave = async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (formData.id === '') {
        delete formData.id;
      }
      const { deviceTypeId, ...extraFormData } = formData;
      extraFormData.deviceType = formData.deviceTypeId;
      setLoading(true);
      if (props.model === 'add') {
        const res: any = await service.save(extraFormData);
        setLoading(false);
        if (res.status === 200) {
          // onlyMessage('保存成功');
          messageModel(res.result.id);
          if (props.reload) {
            props.reload();
          }
          props.close();
          form.resetFields();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        }
      } else {
        const res = await service.update(extraFormData);
        setLoading(false);
        if (res.status === 200) {
          onlyMessage('保存成功');
          if (props.reload) {
            props.reload();
          }
          props.close();
          form.resetFields();
          if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(res);
            setTimeout(() => window.close(), 300);
          }
        }
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
      width={640}
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
          <Col span={24}>
            <Form.Item label={'产品分类'} name={'classifiedId'}>
              <TreeSelect
                showSearch
                allowClear
                onSelect={(_: any, node: any) => {
                  form.setFieldsValue({
                    classifiedName: node.name,
                  });
                }}
                filterTreeNode={(input, treeNode) => treeNode.name.includes(input)}
                placeholder={`${intlFormat('pages.form.tip.select', '请选择')}产品分类`}
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
                disabled={!!props.data?.accessId}
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
    </Modal>
  );
};
export default Save;
