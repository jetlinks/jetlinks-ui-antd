import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Switch,
  Tooltip,
  TreeSelect,
} from 'antd';
import Permission from '@/pages/system/Menu/components/permission';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Menu';
import { useRequest } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';
// import { debounce } from 'lodash';
import Title from '../components/Title';
import { UploadImage } from '@/components';
import { QuestionCircleFilled } from '@ant-design/icons';

type EditProps = {
  data: MenuItem;
  onLoad: (id: string) => void;
};

export default (props: EditProps) => {
  const intl = useIntl();
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(true);
  const [accessSupport, setAccessSupport] = useState('unsupported');

  const [form] = Form.useForm();

  const { data: permissions, run: queryPermissions } = useRequest(service.queryPermission, {
    manual: true,
    formatResult: (response) => response.result.data,
  });

  const { data: menuThree, run: queryMenuThree } = useRequest(service.queryMenuThree, {
    manual: true,
    formatResult: (response) => response.result,
  });

  const { data: assetsType, run: queryAssetsType } = useRequest(service.queryAssetsType, {
    manual: true,
    formatResult: (response) => response.result,
  });

  const saveData = async () => {
    const formData = await form.validateFields();
    if (formData) {
      const response: any = await service.update(formData);
      if (response.status === 200) {
        message.success('操作成功！');
        setDisabled(true);
        props.onLoad(response.result.id);
      } else {
        message.error('操作失败！');
      }
    }
  };

  // const filterThree = (e: any) => {
  //   const _data: any = {
  //     paging: false,
  //   };
  //   if (e.target.value) {
  //     _data.terms = [{ column: 'name', value: e.target.value }];
  //   }
  //   queryPermissions(_data);
  // };

  useEffect(() => {
    queryPermissions({ paging: false });
    queryMenuThree({ paging: false });
    queryAssetsType();
    /* eslint-disable */
  }, []);

  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        ...props.data,
        accessSupport: props.data.accessSupport ? props.data.accessSupport.value : 'unsupported',
      });
      setAccessSupport(props.data.accessSupport ? props.data.accessSupport.value : 'unsupported');
    }
    setDisabled(!!props.data.id);
    /* eslint-disable */
  }, [props.data]);

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Card>
          <Title title={'基本信息'} />
          <Row>
            <Col span={3}>
              <Form.Item
                name={'icon'}
                label={'菜单图标'}
                required={true}
                rules={[{ required: true, message: '请上传图标' }]}
              >
                <UploadImage disabled={disabled} style={{ width: 140, height: 130 }} />
              </Form.Item>
            </Col>
            <Col span={21}>
              <Row gutter={[24, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={intl.formatMessage({
                      id: 'pages.table.name',
                      defaultMessage: '名称',
                    })}
                    required={true}
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Input disabled={disabled} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    label={intl.formatMessage({
                      id: 'page.system.menu.encoding',
                      defaultMessage: '编码',
                    })}
                    required={true}
                    rules={[{ required: true, message: '请输入编码' }]}
                  >
                    <Input disabled={disabled} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="url"
                    label={intl.formatMessage({
                      id: 'page.system.menu.url',
                      defaultMessage: '页面地址',
                    })}
                    required={true}
                    rules={[
                      { required: true, message: '请输入页面地址' },
                      { max: 120, message: '最多可输入120字符' },
                    ]}
                  >
                    <Input disabled={disabled} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sortIndex"
                    label={intl.formatMessage({
                      id: 'page.system.menu.sort',
                      defaultMessage: '排序',
                    })}
                    rules={[
                      {
                        pattern: /^[0-9]*[1-9][0-9]*$/,
                        message: '请输入大于0的整数',
                      },
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} disabled={disabled} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 24 }}>
          <Title
            title={'权限配置'}
            toolbarRender={
              <Switch
                disabled={disabled}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={show}
                onChange={(checked) => {
                  setShow(checked);
                }}
              />
            }
          />
          {show && (
            <Row gutter={[0, 10]}>
              <Col span={24}>
                <Form.Item
                  label={'数据权限控制'}
                  tooltip={'此菜单页面数据所对应的资产类型'}
                  name={'accessSupport'}
                >
                  <Radio.Group
                    onChange={(e) => {
                      setAccessSupport(e.target.value);
                    }}
                    disabled={disabled}
                  >
                    <Radio value={'unsupported'}>不支持</Radio>
                    <Radio value={'support'}>支持</Radio>
                    <Radio value={'indirect'}>
                      间接控制
                      <Tooltip
                        placement="topLeft"
                        title={'此菜单内的数据基于其他菜单的数据权限控制'}
                      >
                        <QuestionCircleFilled style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                {accessSupport === 'support' && (
                  <Form.Item name={'assetType'}>
                    <Select
                      style={{ width: 500 }}
                      disabled={disabled}
                      options={
                        assetsType
                          ? assetsType.map((item: any) => ({ label: item.name, value: item.id }))
                          : []
                      }
                    />
                  </Form.Item>
                )}
                {accessSupport === 'indirect' && (
                  <Form.Item name={'indirectMenus'}>
                    <TreeSelect
                      style={{ width: 400 }}
                      disabled={disabled}
                      multiple
                      fieldNames={{ label: 'name', value: 'id' }}
                      treeData={menuThree}
                    />
                  </Form.Item>
                )}
                <Form.Item
                  label={intl.formatMessage({
                    id: 'page.system.menu.permissions',
                    defaultMessage: '权限',
                  })}
                  name="permissions"
                >
                  {/*<Input disabled={disabled} onChange={debounce(filterThree, 300)} style={{ width: 300 }}/>*/}
                  {/*<Form.Item name='permissions'>*/}
                  <Permission
                    title={intl.formatMessage({
                      id: 'page.system.menu.permissions.operate',
                      defaultMessage: '操作权限',
                    })}
                    disabled={disabled}
                    data={permissions}
                  />
                  {/*</Form.Item>*/}
                </Form.Item>
                <Form.Item hidden name={'id'}>
                  <Input />
                </Form.Item>
                <Form.Item hidden name={'parentId'}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Button
            type="primary"
            onClick={() => {
              if (disabled) {
                setDisabled(false);
              } else {
                saveData();
              }
            }}
          >
            {intl.formatMessage({
              id: `pages.data.option.${disabled ? 'edit' : 'save'}`,
              defaultMessage: '编辑',
            })}
          </Button>
        </Card>
      </Form>
    </div>
  );
};
