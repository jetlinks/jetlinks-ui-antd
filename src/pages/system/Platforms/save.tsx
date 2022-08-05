import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Password,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from '@formily/antd';
import { Modal } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import type { ISchema } from '@formily/json-schema';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import { service } from '@/pages/system/Platforms/index';
import { onlyMessage, randomString } from '@/utils/util';
import { getMenuPathByCode } from '@/utils/menu';

interface SaveProps {
  visible: boolean;
  type: 'save' | 'edit';
  data?: any;
  onReload?: () => void;
  onCancel?: () => void;
}

export default (props: SaveProps) => {
  const [loading, setLoading] = useState(false);
  const { permission: RolePermission } = usePermissions('system/Role');

  console.log(RolePermission);

  const SchemaField = createSchemaField({
    components: {
      Checkbox,
      Form,
      FormGrid,
      FormItem,
      Input,
      NumberPicker,
      Select,
      Switch,
      TreeSelect,
      Password,
      Radio,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const getRole = () => service.queryRoleList();

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFieldValueChange('enableOAuth2', (field) => {
            form.setFieldState('redirectUrl', (state) => {
              state.visible = field.value;
            });
          });
        },
      }),
    [props.data, RolePermission],
  );

  const getDetail = async (id: string) => {
    const resp = await service.getDetail(id);
    if (resp.status === 200) {
      form.setInitialValues({
        ...resp.result,
        confirm_password: resp.result.password,
      });
    }
  };

  useEffect(() => {
    if (props.visible) {
      if (props.type === 'edit') {
        getDetail(props.data.id);
      } else {
        form.setInitialValues({
          enableOAuth2: false,
          id: randomString(16),
          secureKey: randomString(),
        });
      }
    } else {
      if (form) {
        form.reset();
      }
    }
  }, [props.type, props.visible, RolePermission]);

  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 1,
          columnGap: 12,
        },
        properties: {
          name: {
            type: 'string',
            title: '名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入名称',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            required: true,
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入名称',
              },
            ],
          },
          id: {
            type: 'string',
            title: 'clientId',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
          },
          secureKey: {
            type: 'string',
            title: 'secureKey',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入secureKey',
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入secureKey',
              },
            ],
          },
          username: {
            type: 'string',
            title: '用户名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            required: true,
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          },
          password: {
            type: 'string',
            title: '密码',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Password',
            'x-component-props': {
              placeholder: '请输入密码',
              checkStrength: true,
            },
            'x-visible': !props.data,
            'x-decorator-props': {
              gridSpan: 1,
            },

            'x-reactions': [
              {
                dependencies: ['.confirm_password'],
                fulfill: {
                  state: {
                    selfErrors:
                      '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
                  },
                },
              },
            ],
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  return new Promise((resolve) => {
                    service
                      .validateField('password', value)
                      .then((resp) => {
                        if (resp.status === 200) {
                          if (resp.result.passed) {
                            resolve('');
                          } else {
                            resolve(resp.result.reason);
                          }
                        }
                        resolve('');
                      })
                      .catch(() => {
                        return '验证失败!';
                      });
                  });
                },
              },
              {
                required: true,
                message: '请输入密码',
              },
            ],
          },
          confirm_password: {
            type: 'string',
            title: '确认密码',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Password',
            'x-component-props': {
              placeholder: '请再次输入密码',
              checkStrength: true,
            },
            'x-visible': !props.data,
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-reactions': [
              {
                dependencies: ['.password'],
                fulfill: {
                  state: {
                    selfErrors:
                      '{{$deps[0] && $self.value && $self.value !== $deps[0] ? "确认密码不匹配" : ""}}',
                  },
                },
              },
            ],
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入确认密码',
              },
            ],
          },
          roleIdList: {
            type: 'string',
            title: '角色',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
              showArrow: true,
              placeholder: '请选择角色',
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
            'x-decorator-props': {
              gridSpan: 2,
              addonAfter: (
                <PermissionButton
                  type="link"
                  style={{ padding: 0 }}
                  isPermission={RolePermission.add}
                  onClick={() => {
                    const router = getMenuPathByCode('system/Role');
                    const tab: any = window.open(`${origin}/#${router}?save=true`);
                    tab!.onTabSaveSuccess = (value: any) => {
                      form.setFieldState('roleIdList', async (state) => {
                        state.dataSource = await getRole().then((resp: any) =>
                          resp.result?.map((item: Record<string, unknown>) => ({
                            ...item,
                            label: item.name,
                            value: item.id,
                          })),
                        );
                        state.value = [...(state.value || []), value.id];
                      });
                    };
                  }}
                >
                  <PlusOutlined />
                </PermissionButton>
              ),
            },
            'x-reactions': ['{{useAsyncDataSource(getRole)}}'],
            'x-validator': [
              {
                required: true,
                message: '请选择角色',
              },
            ],
          },
          enableOAuth2: {
            type: 'boolean',
            title: '开启OAth2',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'button',
              buttonStyle: 'solid',
            },
            'x-decorator-props': {
              gridSpan: 2,
              tooltip: '免密授权',
            },
            enum: [
              { label: '启用', value: true },
              { label: '关闭', value: false },
            ],
          },
          redirectUrl: {
            type: 'string',
            title: 'redirectUrl',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入redirectUrl',
            },
            // 'x-hidden': true,
            'x-visible': false,
            'x-decorator-props': {
              gridSpan: 2,
              tooltip: '授权后自动跳转的页面地址',
            },
            'x-validator': [
              // {
              //   max: 128,
              //   message: '最多可输入128个字符',
              // },
              {
                required: true,
                message: '请输入redirectUrl',
              },
            ],
          },
          ipWhiteList: {
            type: 'string',
            title: 'IP白名单',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入IP白名单，多个地址回车分隔，不填默认均可访问',
              rows: 3,
            },
          },
          description: {
            type: 'string',
            title: '说明',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              rows: 3,
              placeholder: '请输入说明',
              showCount: true,
              maxLength: 200,
            },
          },
        },
      },
    },
  };

  /**
   * 关闭Modal
   * @param type 是否需要刷新外部table数据
   * @param id 传递上级部门id，用于table展开父节点
   */
  const modalClose = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const saveData = useCallback(async () => {
    const data: any = await form.submit();
    if (data) {
      console.log(data);
      setLoading(true);
      const resp: any = props.type === 'edit' ? await service.edit(data) : await service.save(data);
      setLoading(false);
      if (resp.status === 200) {
        if (props.onReload) {
          props.onReload();
        }
        modalClose();
        onlyMessage('操作成功');
      }
    }
  }, [props.type, form]);

  return (
    <Modal
      maskClosable={false}
      visible={props.visible}
      destroyOnClose={true}
      confirmLoading={loading}
      onOk={saveData}
      onCancel={modalClose}
      width={880}
      title={props.data && props.data.id ? '编辑' : '新增'}
    >
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getRole }} />
      </Form>
    </Modal>
  );
};
