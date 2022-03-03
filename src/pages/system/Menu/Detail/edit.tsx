import { Form, Input, InputNumber, Button, message } from 'antd';
import Permission from '@/pages/system/Menu/components/permission';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Menu';
import { useRequest } from 'umi';
import type { MenuItem } from '@/pages/system/Menu/typing';

type EditProps = {
  data: MenuItem;
  onLoad: () => void;
};

export default (props: EditProps) => {
  const intl = useIntl();
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();

  const { data: permissions, run: queryPermissions } = useRequest(service.queryPermission, {
    manual: true,
    formatResult: (response) => response.result.data,
  });

  const saveData = async () => {
    const formData = await form.validateFields();
    if (formData) {
      const response: any = await service.update(formData);
      if (response.status === 200) {
        message.success('操作成功！');
        setDisabled(true);
        props.onLoad();
      } else {
        message.error('操作失败！');
      }
    }
  };

  useEffect(() => {
    queryPermissions({ paging: false });
    /* eslint-disable */
  }, []);

  useEffect(() => {
    if (form) {
      form.setFieldsValue(props.data);
    }
    /* eslint-disable */
  }, [props.data]);

  return (
    <div>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          name="code"
          label={intl.formatMessage({
            id: 'page.system.menu.encoding',
            defaultMessage: '编码',
          })}
          required={true}
          rules={[{ required: true, message: '该字段是必填字段' }]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="name"
          label={intl.formatMessage({
            id: 'pages.table.name',
            defaultMessage: '名称',
          })}
          required={true}
          rules={[{ required: true, message: '该字段是必填字段' }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="url"
          label={intl.formatMessage({
            id: 'page.system.menu.url',
            defaultMessage: '页面地址',
          })}
          required={true}
          rules={[{ required: true, message: '该字段是必填字段' }]}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'page.system.menu.permissions',
            defaultMessage: '权限',
          })}
        >
          <Input disabled={disabled} />
          <Form.Item name="permissions">
            <Permission
              title={intl.formatMessage({
                id: 'page.system.menu.permissions.operate',
                defaultMessage: '操作权限',
              })}
              disabled={disabled}
              data={permissions}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="sortIndex"
          label={intl.formatMessage({
            id: 'page.system.menu.sort',
            defaultMessage: '排序说明',
          })}
        >
          <InputNumber style={{ width: '100%' }} disabled={disabled} />
        </Form.Item>
        <Form.Item
          name="describe"
          label={intl.formatMessage({
            id: 'pages.table.describe',
            defaultMessage: '描述',
          })}
        >
          <Input.TextArea disabled={disabled} />
        </Form.Item>
        <Form.Item name="id" hidden={true}>
          <Input />
        </Form.Item>
      </Form>
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
    </div>
  );
};
