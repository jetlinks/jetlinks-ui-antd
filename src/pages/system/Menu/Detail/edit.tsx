import { Card, Col, Form, Input, InputNumber, Radio, Row, Select, Tooltip, TreeSelect } from 'antd';
import Permission from '@/pages/system/Menu/components/permission';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Menu';
import { useHistory, useRequest } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';
import { debounce } from 'lodash';
import Title from '../components/Title';
import Icons from '../components/Icons';
import { QuestionCircleFilled } from '@ant-design/icons';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { PermissionButton } from '@/components';
import { isNoCommunity, onlyMessage } from '@/utils/util';

type EditProps = {
  data: MenuItem;
  basePath?: string;
  onLoad: (id: string) => void;
};

export default (props: EditProps) => {
  const intl = useIntl();
  // const [disabled, setDisabled] = useState(true);
  const [show] = useState(true);
  const [loading, setLoading] = useState(false);
  const [accessSupport, setAccessSupport] = useState('unsupported');
  const history = useHistory();
  const { getOtherPermission } = PermissionButton.usePermission('system/Menu');

  const [form] = Form.useForm();

  const { data: permissions, run: queryPermissions } = useRequest(service.queryPermission, {
    manual: true,
    formatResult: (response) => response.result,
  });

  const { data: menuThree, run: queryMenuThree } = useRequest(service.queryMenuThree, {
    manual: true,
    formatResult: (response) => response.result,
  });

  const { data: assetsType, run: queryAssetsType } = useRequest(service.queryAssetsType, {
    manual: true,
    formatResult: (response) => response.result,
  });

  /**
   * 跳转详情页
   * @param id
   */
  const pageJump = (id?: string) => {
    // 跳转详情
    history.push(`${getMenuPathByParams(MENUS_CODE['system/Menu/Detail'], id)}`);
  };

  const saveData = async () => {
    const formData = await form.validateFields();
    if (formData) {
      formData.owner = 'iot';
      // console.log(formData)
      setLoading(true);
      const response: any = !formData.id
        ? await service.save(formData)
        : await service.update(formData);
      setLoading(false);
      if (response.status === 200) {
        onlyMessage('操作成功！');
        // setDisabled(true);
        // 新增后刷新页面，编辑则不需要
        if (!props.data.id) {
          pageJump(response.result.id);
        }
      } else {
        onlyMessage('操作失败！', 'error');
      }
    }
  };

  useEffect(() => {
    if (form && props.basePath) {
      form.setFieldsValue({
        url: props.basePath,
      });
    }
    queryPermissions({ paging: false });
    queryMenuThree({ paging: false });
    if (isNoCommunity) {
      queryAssetsType();
    }
    /* eslint-disable */
  }, []);

  const filterThree = (e: any) => {
    const _data: any = {
      paging: false,
    };
    if (e.target.value) {
      _data.terms = [{ column: 'name$like', value: `%${e.target.value}%` }];
    }
    queryPermissions(_data);
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        ...props.data,
        accessSupport: props.data.accessSupport ? props.data.accessSupport.value : 'unsupported',
      });
      setAccessSupport(props.data.accessSupport ? props.data.accessSupport.value : 'unsupported');
    }
    // setDisabled(!!props.data.id);

    // if (props.data.options) {
    //   setShow(props.data.options.switch);
    // }
    /* eslint-disable */
  }, [props.data]);

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Card>
          <Title title={'基本信息'} />
          <Row>
            <Col flex={'186px'}>
              <Form.Item
                name={'icon'}
                label={'菜单图标'}
                required={true}
                rules={[{ required: true, message: '请上传图标' }]}
              >
                {/* <UploadImage
                  types={['image/png']}
                  disabled={disabled}
                  style={{ width: 140, height: 130 }}
                /> */}
                <Icons />
              </Form.Item>
            </Col>
            <Col flex="auto">
              <Row gutter={[24, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={intl.formatMessage({
                      id: 'pages.table.name',
                      defaultMessage: '名称',
                    })}
                    required={true}
                    rules={[
                      { required: true, message: '请输入名称' },
                      { max: 64, message: '最多可输入64个字符' },
                    ]}
                  >
                    <Input placeholder={'请输入名称'} />
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
                    <Input placeholder={'请输入编码'} />
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
                    <Input placeholder={'请输入页面地址'} />
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
                    <InputNumber style={{ width: '100%' }} placeholder={'请输入排序'} />
                  </Form.Item>
                </Col>
              </Row>
              {props.data.appId && (
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item name="appId" label="appId">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={24}>
              <Form.Item name={'describe'} label={'说明'}>
                <Input.TextArea rows={4} maxLength={200} showCount placeholder={'请输入说明'} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {!props.data.appId && (
          <Card style={{ marginTop: 24 }}>
            <Title
              title={'权限配置'}
              // toolbarRender={
              //   <Switch
              //     disabled={disabled}
              //     checkedChildren="开启"
              //     unCheckedChildren="关闭"
              //     checked={show}
              //     onChange={(checked) => {
              //       setShow(checked);
              //     }}
              //   />
              // }
            />
            {show && (
              <Row gutter={[0, 10]}>
                <Col span={24}>
                  {isNoCommunity && (
                    <Form.Item
                      label={'数据权限控制'}
                      tooltip={'此菜单页面数据所对应的资产类型'}
                      name={'accessSupport'}
                      required
                    >
                      <Radio.Group
                        onChange={(e) => {
                          setAccessSupport(e.target.value);
                        }}
                        // disabled={disabled}
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
                  )}
                  {accessSupport === 'support' && (
                    <Form.Item
                      name={'assetType'}
                      rules={[{ required: true, message: '请选择资产类型' }]}
                    >
                      <Select
                        style={{ width: 500 }}
                        // disabled={disabled}
                        placeholder={'请选择资产类型'}
                        options={
                          assetsType
                            ? assetsType.map((item: any) => ({ label: item.name, value: item.id }))
                            : []
                        }
                      />
                    </Form.Item>
                  )}
                  {accessSupport === 'indirect' && (
                    <Form.Item
                      name={'indirectMenus'}
                      rules={[{ required: true, message: '请选择关联菜单' }]}
                    >
                      <TreeSelect
                        style={{ width: 400 }}
                        // disabled={disabled}
                        multiple
                        placeholder={'请选择关联菜单'}
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
                  >
                    <Input
                      allowClear
                      onChange={debounce(filterThree, 500)}
                      style={{ width: 300, marginBottom: 12 }}
                      placeholder={'请输入权限名称'}
                    />
                    <Form.Item name="permissions" noStyle>
                      <Permission
                        title={intl.formatMessage({
                          id: 'page.system.menu.permissions.operate',
                          defaultMessage: '权限操作',
                        })}
                        // disabled={disabled}
                        data={permissions}
                      />
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <PermissionButton
              type="primary"
              onClick={() => {
                // if (disabled) {
                //   setDisabled(false);
                // } else {
                //   saveData();
                // }
                saveData();
              }}
              loading={loading}
              isPermission={getOtherPermission(['add', 'update'])}
            >
              {intl.formatMessage({
                // id: `pages.data.option.${disabled ? 'edit' : 'save'}`,
                id: `pages.data.option.save`,
                defaultMessage: '编辑',
              })}
            </PermissionButton>
          </Card>
        )}

        <Form.Item hidden name={'id'}>
          <Input />
        </Form.Item>
        <Form.Item hidden name={'parentId'}>
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};
